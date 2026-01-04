// ==UserScript==
// @name         DoubanFlix - 在豆瓣页面获取添加资源链接（网盘，磁力，在线），支持电影，游戏，音乐，书籍
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  在豆瓣页面获取添加资源链接（网盘，磁力，在线），支持电影，游戏，音乐，书籍
// @updatenote   1. 加快了连接获取时间
//               2. 修复了广告屏蔽功能
//               3. 修复版本号问题
// @author       Moz
// @match        https://movie.douban.com/subject/*
// @match        https://www.douban.com/game/*
// @match        https://music.douban.com/subject/*
// @match        https://book.douban.com/subject/*
// @match        https://hifasgfcasxgvc.doubanflix.com/*
// @match        http://localhost:5173/*
// @match        http://localhost:5174/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      scriptcat.org
// @connect      lanzoum.com
// @connect      baidu.com
// @connect      weiyun.com
// @connect      aliyundrive.com
// @connect      cloud.189.cn
// @connect      123pan.com
// @connect      quark.cn
// @connect      xunlei.com
// @connect      cowtransfer.com
// @connect      wenshushu.cn
// @connect      115cdn.com
// @connect      115.com
// @connect      bilibili.com
// @connect      api.doubanflix.com
// @run-at       document-start
// @license      MIT
// @icon         https://cdn.zerror.cc/images/%E8%B1%86%E7%93%A3%E7%BD%91.png
// @downloadURL https://update.greasyfork.org/scripts/550853/DoubanFlix%20-%20%E5%9C%A8%E8%B1%86%E7%93%A3%E9%A1%B5%E9%9D%A2%E8%8E%B7%E5%8F%96%E6%B7%BB%E5%8A%A0%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%88%E7%BD%91%E7%9B%98%EF%BC%8C%E7%A3%81%E5%8A%9B%EF%BC%8C%E5%9C%A8%E7%BA%BF%EF%BC%89%EF%BC%8C%E6%94%AF%E6%8C%81%E7%94%B5%E5%BD%B1%EF%BC%8C%E6%B8%B8%E6%88%8F%EF%BC%8C%E9%9F%B3%E4%B9%90%EF%BC%8C%E4%B9%A6%E7%B1%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/550853/DoubanFlix%20-%20%E5%9C%A8%E8%B1%86%E7%93%A3%E9%A1%B5%E9%9D%A2%E8%8E%B7%E5%8F%96%E6%B7%BB%E5%8A%A0%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%88%E7%BD%91%E7%9B%98%EF%BC%8C%E7%A3%81%E5%8A%9B%EF%BC%8C%E5%9C%A8%E7%BA%BF%EF%BC%89%EF%BC%8C%E6%94%AF%E6%8C%81%E7%94%B5%E5%BD%B1%EF%BC%8C%E6%B8%B8%E6%88%8F%EF%BC%8C%E9%9F%B3%E4%B9%90%EF%BC%8C%E4%B9%A6%E7%B1%8D.meta.js
// ==/UserScript==

// 注入CSS样式
(function() {
    const style = document.createElement('style');
    style.textContent = `
.content-wrapper[data-v-71ea894a] {
  padding: 16px;
}
.movie-info[data-v-71ea894a] {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #00a1d6;
}
.movie-title[data-v-71ea894a] {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}
.movie-meta[data-v-71ea894a] {
  display: flex;
  gap: 12px;
  align-items: center;
}
.movie-meta .year[data-v-71ea894a] {
  background: #6c757d;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}
.movie-meta .rating[data-v-71ea894a] {
  color: #ff6b35;
  font-weight: 600;
  font-size: 13px;
}
.navigation-bar[data-v-71ea894a] {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}
.nav-btn[data-v-71ea894a] {
  flex: 1;
  padding: 8px 4px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  border-bottom: 1px solid transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.nav-btn[data-v-71ea894a]:hover {
  /* background-color: #f5f5f5;
  color: #333; */
}
.nav-btn.active[data-v-71ea894a] {
  color: #00a1d6;
  border-bottom-color: #00a1d6;
  /* background-color: #f8fbff; */
}
.tab-content[data-v-71ea894a] {
  min-height: 200px;
}
.tab-panel[data-v-71ea894a] {
  padding-top: 16px 0;
}
.tab-panel h4[data-v-71ea894a] {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}
.tab-panel p[data-v-71ea894a] {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

/* 二级导航样式 */
.sub-nav[data-v-71ea894a] {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  padding: 4px;
  background: #e9ecef;
  border-radius: 6px;
}
.sub-tab[data-v-71ea894a] {
  flex: 1;
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.sub-tab[data-v-71ea894a]:hover {
  background: #dee2e6;
  color: #495057;
}
.sub-tab.active[data-v-71ea894a] {
  background: #007bff;
  color: white;
  font-weight: 500;
}
.sub-content[data-v-71ea894a] {
  margin-top: 8px;
}
.sub-tab-content[data-v-71ea894a] {
  padding: 8px 0;
}
.sub-tab-content p[data-v-71ea894a] {
  margin: 4px 0;
  color: #666;
  font-size: 12px;
}
.no-subject[data-v-71ea894a] {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}
.no-subject p[data-v-71ea894a] {
  margin: 8px 0;
  line-height: 1.5;
}
.no-subject .hint[data-v-71ea894a] {
  font-size: 12px;
  color: #999;
  font-style: italic;
}
.hint-list[data-v-71ea894a] {
  color: #666;
  font-size: 13px;
  margin: 4px 0 0 16px;
  padding: 0;
}
.hint-list li[data-v-71ea894a] {
  margin: 2px 0;
}
.icon-wrapper[data-v-71ea894a] {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}
.count-badge[data-v-71ea894a] {
  border: 1px solid #ffffff;
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  font-size: 10px;
  padding: 0 3px;
  border-radius: 8px;
  line-height: 14px;
  position: absolute;
  top: -4px;
  right: -10px;
  min-width: 14px;
  text-align: center;
  z-index: 1;
}
.nav-btn.active .count-badge[data-v-71ea894a] {
  background-color: #e6f7ff;
  color: #00a1d6;
}
.icon[data-v-71ea894a] {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
.count-badge.invisible[data-v-71ea894a] {
  visibility: hidden;
}

.custom-window[data-v-74a2f745] {
  position: relative;
  width: 100%;
  max-width: 350px;
  min-height: 200px;
  background: white;
  border: 1px solid rgba(239,239,239,1.00);
  border-radius: 12px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.window-header[data-v-74a2f745] {
  /* background: linear-gradient(90deg, #00a1d6, #0084c7); */
  color: rgb(84, 84, 84);
  padding: 6px 12px;
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.window-title[data-v-74a2f745] {
  font-weight: 300;
  font-size: 12px;
}
.window-content[data-v-74a2f745] {
  padding: 0;
}

/* Tooltip styles */
.tooltip-container[data-v-74a2f745] {
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.tooltip[data-v-74a2f745] {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5em 1em;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  background: #333;
  color: #fff;
  z-index: 9999;
  border-radius: 8px;
  scale: 0;
  transform-origin: 0 0;
  font-weight: 400;
  font-size: 12px;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  white-space: nowrap;
}
.tooltip[data-v-74a2f745]::before {
  position: absolute;
  content: "";
  height: 0.6em;
  width: 0.6em;
  bottom: -0.2em;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  background: #333;
}
.tooltip-container:hover .tooltip[data-v-74a2f745] {
  top: -45px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  scale: 1;
  animation: shake-74a2f745 0.5s ease-in-out both;
}
@keyframes shake-74a2f745 {
0% { rotate: 0;
}
25% { rotate: 7deg;
}
50% { rotate: -7deg;
}
75% { rotate: 1deg;
}
100% { rotate: 0;
}
}
/* 全局样式重置 */
* {

}

/* 触发按钮样式增强 */
#douban-trigger-btn:hover {
  background: #005a1a !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 119, 34, 0.5);
}

/* 窗口容器样式 */
#douban-custom-window {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#douban-custom-window ::-webkit-scrollbar {
  width: 6px;
}

#douban-custom-window ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

#douban-custom-window ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

#douban-custom-window ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.custom-window {
  animation: fadeIn 0.3s ease-out;
}

.window-content > * {
  animation: slideIn 0.4s ease-out;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .custom-window {
    width: 90vw !important;
    left: 5vw !important;
  }
  
  .stats-grid {
    grid-template-columns: 1fr !important;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .custom-window {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .window-content h3,
  .window-content h4 {
    color: #e2e8f0;
  }
  
  .window-content p {
    color: #cbd5e0;
  }
  
  .feature-section li {
    background: #4a5568;
    color: #cbd5e0;
  }
  
  .info-section {
    background: #4a5568;
    color: #cbd5e0;
  }
  
  .info-item strong {
    color: #e2e8f0;
  }
}

/* Option 元素美化样式 */
select option {
  color: #666666; /* 深灰色文字 */
  background-color: #ffffff;
  padding: 8px 12px; /* 与边间距离 */
  border-radius: 6px; /* 圆角矩形 */
  margin: 2px 0;
  transition: background-color 0.2s ease;
}

select option:hover {
  background-color: #f5f5f5; /* hover时浅灰背景 */
}

/* 针对不同浏览器的兼容性 */
select {
  border-radius: 6px;
  padding: 8px 12px;
}

/* 深色模式下的option样式 */
@media (prefers-color-scheme: dark) {
  select option {
    color: #a0a0a0;
    background-color: #2d3748;
  }
  
  select option:hover {
    background-color: #718096; /* 更浅的灰色背景 */
    color: #f7fafc; /* hover时更亮的文字 */
  }
}
.custom-select[data-v-d868d504] {
  position: relative;
  width: 100%;
  font-size: 14px;
}
.select-trigger[data-v-d868d504] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 8px;
  border: 1px solid #ddd;
  border-radius: 9999px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}
.select-trigger[data-v-d868d504]:hover {
}
.select-trigger[data-v-d868d504]:focus {
  outline: none;
}
.selected-text[data-v-d868d504] {
  margin-top: -2px;
  flex: 1;
  text-align: left;
  color: #333;
}
.arrow[data-v-d868d504] {
  width: 16px !important;
  height: 16px !important;
  transition: transform 0.2s ease;
  color: #666 !important;
  background: none !important;
  background-image: none !important;
  border: none !important;
  transform-origin: center !important;
  display: inline-block !important;
}
.arrow-up[data-v-d868d504] {
  transform: rotate(180deg);
  padding-left: 0px;
}
.select-dropdown[data-v-d868d504] {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0; /* 跟随父元素宽度 */
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}
.select-option[data-v-d868d504] {
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666666; /* 深灰色文字 */
  background-color: #ffffff;
  border-radius: 10px;
  margin: 2px;
}
.select-option[data-v-d868d504]:hover {
  background-color: #f5f5f5 !important; /* 浅灰色背景 */
  color: #333333 !important; /* 深色文字 */
}
.select-option.selected[data-v-d868d504] {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}
.select-option.selected[data-v-d868d504]:hover {
  background-color: #bbdefb !important;
  color: #1565c0 !important;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
.select-trigger[data-v-d868d504] {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
}
.select-trigger[data-v-d868d504]:hover {
}
.selected-text[data-v-d868d504] {
    color: #e2e8f0;
}
.arrow[data-v-d868d504] {
    color: #a0aec0;
}
.select-dropdown[data-v-d868d504] {
    border-radius: 4px;
    background-color: #2d3748;
    border-color: #4a5568;
}
.select-option[data-v-d868d504] {
    color: #a0a0a0;
    background-color: #2d3748;
}
.select-option[data-v-d868d504]:hover {
    background-color: #718096 !important; /* 更浅的灰色背景 */
    color: #f7fafc !important; /* 更亮的文字 */
}
.select-option.selected[data-v-d868d504] {
    background-color: #2b6cb0;
    color: #90cdf4;
}
.select-option.selected[data-v-d868d504]:hover {
    background-color: #2c5282 !important;
    color: #bee3f8 !important;
}
}

.loading-container[data-v-da15572b] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  text-align: center;
}
.spinner[data-v-da15572b] {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #00a1d6;
  border-radius: 50%;
  animation: spin-da15572b 1s linear infinite;
  margin-bottom: 12px;
}
.loading-text[data-v-da15572b] {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* 不同尺寸的spinner */
.loading-container.small .spinner[data-v-da15572b] {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin-bottom: 8px;
}
.loading-container.small .loading-text[data-v-da15572b] {
  font-size: 12px;
}
.loading-container.large .spinner[data-v-da15572b] {
  width: 48px;
  height: 48px;
  border-width: 4px;
  margin-bottom: 16px;
}
.loading-container.large .loading-text[data-v-da15572b] {
  font-size: 16px;
}

/* 旋转动画 */
@keyframes spin-da15572b {
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
}

/* 响应式设计 */
@media (max-width: 480px) {
.loading-container[data-v-da15572b] {
    padding: 20px 15px;
}
.spinner[data-v-da15572b] {
    width: 28px;
    height: 28px;
    border-width: 2px;
}
.loading-text[data-v-da15572b] {
    font-size: 13px;
}
}

.link-item.skeleton[data-v-115afd35] {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}
.skeleton-element[data-v-115afd35] {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading-115afd35 1.5s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading-115afd35 {
0% {
    background-position: 200% 0;
}
100% {
    background-position: -200% 0;
}
}
.link-header[data-v-115afd35] {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.platform-badge[data-v-115afd35] {
  display: flex;
  align-items: center;
  gap: 6px;
}
.skeleton-icon[data-v-115afd35] {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.link-meta[data-v-115afd35] {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.skeleton-language[data-v-115afd35] {
  width: 40px;
  height: 16px;
}
.feature-tags[data-v-115afd35] {
  display: flex;
  gap: 6px;
}
.skeleton-tag[data-v-115afd35] {
  width: 30px;
  height: 14px;
}
.link-title-row[data-v-115afd35] {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.skeleton-title[data-v-115afd35] {
  width: 70%;
  height: 20px;
}
.skeleton-arrow[data-v-115afd35] {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.ios-checkbox[data-v-418f338a] {
    --checkbox-size: 28px;
    --checkbox-color: #3b82f6;
    --checkbox-bg: #dbeafe;
    --checkbox-border: #93c5fd;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    vertical-align: middle;
}
.ios-checkbox input[data-v-418f338a] {
    display: none;
}
.checkbox-wrapper[data-v-418f338a] {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}
.checkbox-bg[data-v-418f338a] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    border: 1px solid #d5d5d5;
    background: white;
    transition: all 0.2s ease;
}
.checkbox-icon[data-v-418f338a] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 16px;
    height: 16px;
    color: white;
    transition: all 0.2s ease;
}
.check-path[data-v-418f338a] {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    transition: stroke-dashoffset 0.3s ease 0.1s;
}
.checkbox-label[data-v-418f338a] {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    line-height: 28px;
    height: 28px;
    display: flex;
    align-items: center;
}

  /* Checked State */
.ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg[data-v-418f338a] {
    background: var(--checkbox-color);
    border-color: var(--checkbox-color);
}
.ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon[data-v-418f338a] {
    transform: translate(-50%, -50%) scale(1);
}
.ios-checkbox input:checked + .checkbox-wrapper .check-path[data-v-418f338a] {
    stroke-dashoffset: 0;
}

  /* Hover Effects */
.ios-checkbox:hover .checkbox-wrapper[data-v-418f338a] {
    transform: scale(1.05);
}

  /* Active Animation */
.ios-checkbox:active .checkbox-wrapper[data-v-418f338a] {
    transform: scale(0.95);
}

  /* Focus Styles */
.ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg[data-v-418f338a] {
    box-shadow: 0 0 0 4px var(--checkbox-bg);
}

  /* Color Themes */
.ios-checkbox.blue[data-v-418f338a] {
    --checkbox-color: #3b82f6;
    --checkbox-bg: #dbeafe;
    --checkbox-border: #93c5fd;
}
.ios-checkbox.green[data-v-418f338a] {
    --checkbox-color: #34c759;
    --checkbox-bg: #34c759;
    --checkbox-border: #34c759;
}
.ios-checkbox.purple[data-v-418f338a] {
    --checkbox-color: #8b5cf6;
    --checkbox-bg: #ede9fe;
    --checkbox-border: #c4b5fd;
}
.ios-checkbox.red[data-v-418f338a] {
    --checkbox-color: #ef4444;
    --checkbox-bg: #fee2e2;
    --checkbox-border: #fca5a5;
}

  /* Animation */
@keyframes bounce-418f338a {
0%,
    100% {
      transform: scale(1);
}
50% {
      transform: scale(1.1);
}
}
.ios-checkbox input:checked + .checkbox-wrapper[data-v-418f338a] {
    animation: bounce-418f338a 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.copy-item[data-v-aaaa00e5] {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: #007bff;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  word-break: break-all;
}
.copy-item[data-v-aaaa00e5]:hover {
  text-decoration: underline;
  background-color: transparent;
}
.copy-item.copied[data-v-aaaa00e5] {
}
.tooltip[data-v-aaaa00e5] {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: #333333d1;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 1000;
}
.tooltip[data-v-aaaa00e5]::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333333d1;
}
.copy-item:hover .tooltip[data-v-aaaa00e5] {
  opacity: 1;
  visibility: visible;
  top: -40px;
}
.extract-code[data-v-aaaa00e5] {
  position: relative;
  display: inline-block;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: #e83e8c;
  cursor: pointer;
  transition: all 0.3s ease;
}
.extract-code[data-v-aaaa00e5]:hover {
  background: #e9ecef;
}
.extract-code.copied[data-v-aaaa00e5] {
}
.extract-code:hover .tooltip[data-v-aaaa00e5] {
  opacity: 1;
  visibility: visible;
  top: -40px;
}

.toast-container[data-v-52e28bd4] {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
}
.toast[data-v-52e28bd4] {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 500px;
  pointer-events: auto;
  cursor: pointer;
  animation: slideDown-52e28bd4 0.3s ease-out;
  transition: all 0.3s ease;
}
.toast[data-v-52e28bd4]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
.error-toast[data-v-52e28bd4] {
  background: #fff5f5;
}
.error-toast span[data-v-52e28bd4] {
  color: #721c24;
}
.success-toast[data-v-52e28bd4] {
  background: #f0fff4;
}
.success-toast span[data-v-52e28bd4] {
  color: #155724;
}
.toast-close[data-v-52e28bd4] {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #999;
  cursor: pointer;
  margin-left: 12px;
  padding: 0;
  line-height: 1;
}
.toast-close[data-v-52e28bd4]:hover {
  color: #666;
}
@keyframes slideDown-52e28bd4 {
from {
    opacity: 0;
    transform: translateY(-20px);
}
to {
    opacity: 1;
    transform: translateY(0);
}
}

.url-input-container[data-v-dad514cd] {
  position: relative;
  width: 100%;
}
.input-wrapper[data-v-dad514cd] {
  position: relative;
  width: 100%;
  border-radius: 20px;
  background: #fff;
  transition: border-color 0.2s ease;
}
.input-wrapper.focused[data-v-dad514cd] {
}
.editable-input[data-v-dad514cd] {
  padding: 8px 12px;
  min-height: 20px;
  font-size: 14px;
  line-height: 20px;
  outline: none;
  border: none;
  background: transparent;
  cursor: text;
  word-break: break-all;
  white-space: pre-wrap;
}
.editable-input[data-v-dad514cd]:empty:before {
  content: attr(data-placeholder);
  color: #999;
  pointer-events: none;
}
.normal-text {
  color: #999;
}
.recognized-text {
  color: #000;
}

.link-manager[data-v-19f7b367] {
  max-width: 1000px;
  margin: 0 auto;
}
.link-stats[data-v-19f7b367] {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}
.stat-item[data-v-19f7b367] {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-label[data-v-19f7b367] {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.stat-value[data-v-19f7b367] {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.add-link-section[data-v-19f7b367] {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.add-link-btn[data-v-19f7b367] {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.add-link-btn[data-v-19f7b367]:hover:not(:disabled) {
  background: #0056b3;
}
.add-link-btn[data-v-19f7b367]:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.auth-hint[data-v-19f7b367] {
  color: #666;
  font-size: 12px;
}
.add-form[data-v-19f7b367] {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.add-form h4[data-v-19f7b367] {
  margin: 0 0 15px 0;
  color: #333;
}
.form-row[data-v-19f7b367] {
  display: flex;
  gap: 15px;
}
.form-group[data-v-19f7b367] {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.form-group label[data-v-19f7b367] {
  margin-bottom: 0;
  font-weight: 540;
  color: #333;
  font-size: 13px;
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
}
.checkbox-group[data-v-19f7b367] {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.form-group input[data-v-19f7b367],
.form-group select[data-v-19f7b367] {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.form-group select[data-v-19f7b367]:focus {
  outline: none;
}
.input-wrapper[data-v-19f7b367] {
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #fff;
  transition: all 0.2s;
}
.input-wrapper input[data-v-19f7b367] {
  width: 95%;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}
.input-wrapper[data-v-19f7b367]:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
.form-actions[data-v-19f7b367] {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.form-actions button[data-v-19f7b367] {
  font-weight: 300;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.form-actions button[type="submit"][data-v-19f7b367] {
  background: #beecc859;
  color: #2e8339;
}
.form-actions button[type="submit"][data-v-19f7b367]:hover:not(:disabled) {
  background: #beecc870;
}
.form-actions button[type="submit"][data-v-19f7b367]:disabled {
  background: #b1efbf;
  cursor: not-allowed;
}
.form-actions button[type="button"][data-v-19f7b367] {
  background: #f1f1f1;
  color: rgb(130, 130, 130);
}
.form-actions button[type="button"][data-v-19f7b367]:hover {
  background: #ececec;
}
.filter-bar[data-v-19f7b367] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 6px;
}
.filter-controls[data-v-19f7b367] {
  display: flex;
  gap: 10px;
}
.filter-bar .custom-select[data-v-19f7b367] {
  width: auto;
  min-width: 100px;
}
.add-link-btn-compact[data-v-19f7b367] {
  width: 32px;
  height: 32px;
  background: #e6f3ff;
  color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  line-height: 1;
  padding: 0;
}
.add-link-btn-compact[data-v-19f7b367]:hover:not(:disabled) {
  background: #dae9f7;
  transform: scale(1);
}
.add-link-btn-compact[data-v-19f7b367]:disabled {
  color: #b2b2b2;
  background: #f5f4f4;
  cursor: not-allowed;
  transform: none;
}
.filter-bar select[data-v-19f7b367] {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}
.links-list[data-v-19f7b367] {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.link-item[data-v-19f7b367] {
  background: #ffffff;
  border: 1px solid rgba(239, 239, 239, 1);
  border-radius: 8px;
  padding: 15px 15px 0px 15px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}
.link-item[data-v-19f7b367]:hover {
  /* box-shadow: 0 4px 8px rgba(0,0,0,0.15); */
}
.link-header[data-v-19f7b367] {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.link-type-badge[data-v-19f7b367] {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}
.link-type-badge.netdisk[data-v-19f7b367] {
  background: #28a745;
}
.link-type-badge.bt[data-v-19f7b367] {
  background: #dc3545;
}
.link-type-badge.online[data-v-19f7b367] {
  background: #007bff;
}
.platform-badge[data-v-19f7b367] {
  padding: 4px 4px;
  background: #ffffff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
}
.platform-icon[data-v-19f7b367] {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.link-meta[data-v-19f7b367] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.file-size[data-v-19f7b367] {
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 10px;
  background: #e3f2fd !important;
  color: #1976d2 !important;
  font-weight: 500;
}
.feature-tags[data-v-19f7b367] {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  margin-left: auto;
}
.feature-tag[data-v-19f7b367] {
  padding: 2px 5px;
  background: #007bff;
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}
.feature-tag.feature-4k[data-v-19f7b367] {
  border: 1px solid #eff524;
  background: #f6ff00;
  color: #232323;
}

/* 4K - 黑底金字 */
.feature-tag.feature-hdr[data-v-19f7b367] {
  background: #ffe55a;
  color: #232323;
}

/* HDR - 金底黑字 */
.feature-tag.feature-dolby[data-v-19f7b367] {
  background: #eaeaea;
  color: #121212;
  font-weight: 300;
}

/* 杜比全景声 - 灰底黑字 */
.feature-tag.feature-subtitle[data-v-19f7b367] {
  background: #cee2e8;
  color: #003366;
  font-weight: 300;
}

/* 软字幕 - 浅蓝底深蓝字 */

/* FLAC无损 - 蓝底白字 */
.feature-tag.feature-flac[data-v-19f7b367] {
  background: #ededed;
  color: #383838;
  font-weight: 500;
}

/* WAV无损 - 深蓝底白字 */
.feature-tag.feature-wav[data-v-19f7b367] {
  background: #ffe3b3;
  color: #ce7f0d;
  font-weight: 500;
}
.link-content[data-v-19f7b367] {
  margin-bottom: 15px;
}
.link-title-row[data-v-19f7b367] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}
.link-title-row[data-v-19f7b367]:hover {
  /* background-color: #f8f9fa; */
}
.link-title[data-v-19f7b367] {
  font-weight: 500;
  color: #333;
  flex: 1;
  overflow: hidden;
  position: relative;
  padding-right: 10px;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  max-height: 2.8em;
  word-break: break-all;
  overflow-wrap: break-word;
}
.link-title.expanded[data-v-19f7b367] {
  display: block;
  -webkit-line-clamp: unset;
  max-height: none;
  white-space: normal;
  padding-right: 10px;
  word-break: break-all;
  overflow-wrap: break-word;
}
.link-title[data-v-19f7b367]::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(to right, transparent, #ffffff 85%);
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.link-title.expanded[data-v-19f7b367]::after {
  opacity: 0;
}
.expand-arrow[data-v-19f7b367] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #666;
  transition: transform 0.3s ease, color 0.2s ease;
}
.expand-arrow[data-v-19f7b367]:hover {
  color: #333;
}
.expand-arrow.expanded[data-v-19f7b367] {
  transform: rotate(180deg);
}
.link-details[data-v-19f7b367] {
  margin-top: 10px;
  animation: slideDown-19f7b367 0.3s ease forwards;
}

/* 链接状态样式 */
.link-status[data-v-19f7b367] {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #dee2e6;
}
.status-label[data-v-19f7b367] {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}
.status-badge[data-v-19f7b367] {
  font-size: 13px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
}
.status-badge.success[data-v-19f7b367] {
  background: rgba(82, 196, 26, 0.1);
  border: 1px solid rgba(82, 196, 26, 0.2);
}
.status-badge.warning[data-v-19f7b367] {
  background: rgba(250, 173, 20, 0.1);
  border: 1px solid rgba(250, 173, 20, 0.2);
}
.status-badge.error[data-v-19f7b367] {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.2);
}
.status-badge.loading[data-v-19f7b367] {
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.2);
}
.status-badge.partial[data-v-19f7b367] {
  background: rgba(250, 140, 22, 0.1);
  border: 1px solid rgba(250, 140, 22, 0.2);
}
@keyframes slideDown-19f7b367 {
from {
    opacity: 0;
    transform: translateY(-10px);
}
to {
    opacity: 1;
    transform: translateY(0);
}
}
.link-url[data-v-19f7b367] {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  cursor: pointer;
}
.link-url a[data-v-19f7b367] {
  color: #007bff;
  text-decoration: none;
  flex: 1;
  word-break: break-all;
}
.link-url span[data-v-19f7b367]:hover {
  text-decoration: none;
  background-color: transparent;
}

/* 参考test.js的链接状态样式 */
/* 默认不显示::before伪元素，只有在有检测状态时才显示 */
.link-url[data-v-19f7b367]::before {
  content: '';
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  width: 0;
  height: 0;
  margin: 0;
  flex-shrink: 0;
  display: none;
}

/* 只有在有检测状态时才显示::before伪元素 */
.link-url.one-pan-tip-success[data-v-19f7b367]::before,
.link-url.one-pan-tip-error[data-v-19f7b367]::before,
.link-url.one-pan-tip-partial[data-v-19f7b367]::before,
.link-url.one-pan-tip-other[data-v-19f7b367]::before,
.link-url.one-pan-tip-lock[data-v-19f7b367]::before {
  width: 1em;
  height: 1em;
  margin: 0 1px 0 1px;
  display: inline-block;
}
.link-url.one-pan-tip-success[data-v-19f7b367]::before {
  content: '';
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACrUlEQVR4Xt2Yu2sUQRzHV/BFxNzMXhEQkRAEJbd763+gnYIWVjYitrYBC8FaSzttFBs7LQQLMdnZ3SSKWFhoYWFvOl+IoImJ5283Znf2O7PPmz3QL3zIcff9PZidnUcs63/V4Nm07QTskhvaC8PAvuoIfu7Y0tQh9E1EjmD3qIn1YWiP6G8xESHsNYw3qtlodv9wmavFa+Kt9keu35vDvGNpGPAnWKgtruDrmL+V3IBvYfKxoSkwEPYZrFVPI2uXt6JJahAn4texbKW6bmoHJ+xdwNqFooBNTNAlWF8rmlMPMLBzoorm5h9ae5WgSSHYXewnFb3K5t/AuoQlo6aYTRLvEhU7BW1nt7EnGi32CI0GebVThz5/0fye4C1rRo1W9w00GkGw93KdOZ/3FI+E7E1UNcxtoDn7Dus4Pj+LvlyMzxYydwdvIzW1khXY1syidaDGAGSnEc+3T2sMKiG/QWvOYTrKqL9JUFNvpX5Soa+A71mAYJc1hhx0EPSlGhTDP6En8QX8jeyLlYyUxlvARhroBPyKxgDwO1KtRPR9rjk3YEvoqfn4ZDbTYFoqzmsMeQoWQGr487aHp0uCLCVPBW5g/0iD531+BA1FSDVT0ZwL8LuGjy+FpsLHXCI0FFK14VqtHl+Gz0QuWXJxQFMRFc0p/gaciqzdmOwDmkrRzLm2j08GcyZCUyXSyLnPe7z145OQ+0nlrarGOnhNpkEJg5fTNvaUKL73oXlSxIOC/eSEAZPi6FNrH/aiyMRcaYIn2GPsQSs3ZCcxuDOEvYX1S0Ur8DUliWHiuyvWrSU34hcxmUF+Y73GMj3n6BSS33bGEe3698dt8MSL/iheiDG3EVGDt+LbDBYtg+brz+PiYB9zdSa6B96kwmvEN+LX3xGN/+/xNTmfvbb2YMw/rz8ZKxg+Um5CmgAAAABJRU5ErkJggg==");
}
.link-url.one-pan-tip-error[data-v-19f7b367] {
  text-decoration: line-through;
}
.link-url.one-pan-tip-error[data-v-19f7b367]::before {
  content: '';
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACm0lEQVR4Xu2Xv47TQBDGfSf+iGQdCSS4gpKr4I6TvQl0lLwEb0HFS9BQ09JR8wQ0UNDQIihAoCsgdhJfOHF3ZsaSrfG36/U6cVIgPumnKPbM7Hh2Z70Ogv/aotI4fJPqcDrXYT4fE/S7oN+ZDpczrb4u9PAx+mxEeRDspFH4jgbO0w7kD0b5/L66hfF6URqpV10TQrii9HCXMPbK4oA4yHqoFzhGJ2XjQWQG7YdEhz9xPC9lR4OIpu4CA/ZJEodfcNxWYZBNQQ//FsduVP9ryk1+GFzHHAzNYvUaHTcNdzvmURPd3UWnPvCZgUQPn2E+lWgnf48OSKKv3ilsPRtDVsO1D/4eO6rmcsRBWGcT00ZyAoPRa+o72kjm++qmtK+Ehg1cSJ+m5DApujZFGxM1lT6Fklh9NA3tnE+wEvX7WFm6lmIMG5ltOunGDA1dcKWkPyfL17FSSce40reQT+dYqE0rnyLkf2qmXxYfJ9K/EJ+n0MgHrFyp1GtNmWCcVStWkD+ESml1ijbe3BvdkLFWTmxpW7BBc7e2gXH4KTM0asPsPnVW/++3CUukfxnkBxq5wEqV3YdrjhsCfV1I30LTSD1CoyYwqdRc6F6bMPJnUl+rldDQhjl99s0TK5d6TOs0Gj6VPpXanowbRNq3bZ74hjhtiU/GO9K+0uJguIfGElmt1Jy+Jqppben8T6WdVXz8sDhVcHL0Xv2G111wTP4QxusSzMNQroPL6LQF/M79tHZeWpw3Aq87HN+pZIUNtysL3TGpUvRhcozB+oKTyu8GV3BMb/FHKQZdF+f5vouyw4FuaXVvaIl8wPhri7aK53z8xcE8+YzxetfJ0bXb9OTLtr3pnF/g8egJzdsuxtiajg+CPTrk7dvfKf+Q/gIqVFE2PCWqFwAAAABJRU5ErkJggg==");
}
.link-url.one-pan-tip-partial[data-v-19f7b367]::before {
  content: '';
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAADYAAAAAQAAANgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAADCgAwAEAAAAAQAAADAAAAAAVrtQ3wAAAAlwSFlzAAAhOAAAITgBRZYxYAAABb9JREFUaAXtWd9vG0UQ3t3z2aljN0nlNKVSlLaEuCEQUfIACIQET5UQBSRStS8IIfHGW976lH8g/wBIiCd+KEhAEVKfICCkgsBUBBwnURuIUpGmTohaO45j+27Z75xDe3t79jnEiIic5NzM7OzMN3t7ezMTQg6vwxX4f6+AsZ/hT05OskzmzjEWT/XFjFR/pCM1aMZS/TEz1W10puJHzJRx5cpbOzMzM3y//NJ/amhsbMz8ZbHwICE0TWySJpzHG9qktEQYWSCELzw6lLyVyWSqDfWbDO45AADPLm4/adu1ZwgnsSZ+9MOU7DAW+XZk6Mh3ew2k5QA457Sz8+FzFrWe45wk9chak1JKCgY3vtramrtBKW1pe7UUwMjISHRpufqKZZPh1iCG0zYYnTszEPk0m81Wws0QGzesYk/PWFepWrzMbX4iYA5nhK5Qg85zxldNmxf6+uwCdNfWWLLKaJLa9AFu8bM24f1CrPVNGb0TNxMfbG5m7gX48Yi1RjwagnHAV7be5NxOqGMCR41S9v3ROLuez2eL/nG/pLd3JHG/ZD8l7D0hXuaIqiHsFePRznfCBNH0GMW2Wfuz/JrY+8dURwYjuXg0+X7x/uxcqZQP/diha1XXl44mTv1s80q3eJd6vbZ5tMarp88+dGI2n89b3jEvx7ysl8MLiz2v2zaMGV9uFxc/Clql8fFxI5ZMp/ED7bVc5zAXNmBLHYfPpeXay8Cgjsl8w8F4fPjxGrEuyBNAR5nxcbGY+1WVuzwAf/7F7Ou7e10c+3TlxRdG35ueng5czURi+JGKbb3q2nDvEWJcLZVyP7m8eteuDJRwzq9tlC8J0nPGY7VKxdwPqiGZv7ViDYmVe9qViXOxa3Hp7h9WZWPDlan3SmX9rhk7bot5p+UxTvnJx0ZP/bi6umrLcpcO3EL4SKnnPPZ8uZj7xp0cdDcs//dBJ1PnwzZ8yHJgABZZJtPaALD6zhdW1hSnTYeZvOYRtYGp+6A12TSwAJMsc2ltAE5uo6QHOCqDXljX2H7c4QO+PLYElnq+5ZE6jDYAJzHz6nKc815R+7hdX0pKIZJFzeULACmxk1VKyjhFwn6kpGl7JuELPj0GRKbrYPMIiTjhlGtq6sMeNSVGeqCotZ31+RRpuoNN8ewLoGr4TxDkNsq8trM6nzpsvgCMqj8AJGZtR6w40PnUYfMFYDN/AG5WqfhoK6vzqcPmC6CtqNpg3BcAs4lvuyCfb8V3jRnbqr5OpurIvM6nDpsvAMv0B4BiRDbejD7e3bWEMtHVAw2Zy4e563zqsPmKCdMihR3FAyopIfpNEQeyt29f306l0m8Xy3QMSokOnoEscIJmgNrkpCoGtrIi9D2BiYlLmwStD+lCGSixocj19YVCuTg/gx/oUJMkJW6JFo18CUwONlkmaG09EE2mXyIWPyfp8q5Oc+rf+hqj5Ly3VZ3w4DPojUph4TMJk0P6nkBdgYvGk+eiqGE9kiZMmIosyMSuL2VxfZic6doA0DETz8bzKqAAR3Ef5FSWuxWZ2HqX8UN1FlRWyvNAw0e92JdGBBYHkyRySW1FhurH7OijwtAZV1HcGQrwWmUjK8m05F4qMtcQjSRFHUz6XB53ZkS+Xvl9VnuIaJ8AJqHdJx+FkKGh1ZEYfhZ0Oy7YVptmwAAsQf4CA0CvEu0+daJtW8+jAFflMn/h/OhNOR0GDZmso9KwCduqHBga9U2VF8U7HS2NeDJ9UV0VaKG4b1QfY89fvTY7CF2Ab9SRwMprwYtWY6kwP92oX9owADhHY+vmcu0NXW8IBThq2L2Wmnhhy9XCed0CocU4OBB5t1mftGkACOK/3FoMFcDfQRzU5i4CwNX+9jrJnRkwP2m2bepo6n9DPwF3El7sA/sPDjcI3A/sv5jkINxADuQ/+dRAwKNvg9YHugcowN0aFpUUihHk80iJhZ62UauzeSg7XIHDFWi8An8B0+Xbcz5Btc4AAAAASUVORK5CYII=");
}
.link-url.one-pan-tip-other[data-v-19f7b367]::before {
  content: '';
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAD5UlEQVR4Xr2YT2jTUBzHMxR0wmDaNXndxIk6EA9TEPQo/rns5MHtJjK2JrHrhhcRBP/cRHYTFMXDQBAVdhVBBGEHDx48iHhQEQ8DFYS5Jenabd3i71eX9uXbpE3S6gce697vb977vT+JoiTAVZSOwlhPr2WIT+v5jLt8UbgONdsUboH+rk5k3JUJ4Vq6pv8a6+lC+7Zjm+nhNQrKCcRpnLxjimfor2VKo+kBJyBg3MY+LFN7i/4TUcrVB8BgPJW2ITbo/zX+zdOJemhTzHf3Y6xIcB1xraBTbpv9s4uGuh/tZGxTm+JpRPta0x6iTUPcEWVL0NQVc/y06mHUb8b8yO7OyqgG+LQN7T3qhxKUFDl4hXpxoQfuDJpmx1BfoG4dQUPv6OkjqNcKgaOXTZ1CvSo0KnUGPA2o1w7KE/DwlCzXNeopTlbVMKliTt2HemFY+b7UgpHZ40ykhTt1YBvKg1jJ+WdnjZJFnbq6sgxtBnUQ2tnH3Mn6qee2wf165hzaIBj3u9G7oypc1NUzsrBETyLZBkL71rxsw1sI12d9catzaCtjG+pdeKhCVYjOSk32Jzojr3i6/MQoXzZSx2V/KEdw1Lz+DrmTz0LZKAh55aLMgxbSm1ry6m2Uy1immJFzcAwxrfwe7+6XO6nNoiEi6a6jzIPq72otkPYU5TK8WOQcVnkRYK1YRuogGiaBpvub55OOLhPlSFmaBd7nfB1B9ZIEOgOveT65flEeBOl+lQfItwtHddIISuqDHID3R9QJgnTv+RILWxFJKMu3EboGobwRli4uhyZGv8toEBXfGUtXbpQ3g2xyvsTkqawUXUJa9WHr4oYvMfkymLT4HVO7VHWqa09QHgWyfe1LDK85aBAFKvDBJTNznlshmzmK8ihUzlY5D37FkjtorifR6H9QkHLgJBWX3vvkxHhfQ6N/jW3uOuQbHFP8PfhxOt3RvdvBtinuTWUrjfZJ7I8CXp2qpw+/rciCJBttzV77gbJG8HuAHLtuVeNG6w4pkW6hzPKFVF/VjusjBhiXVvgtnwJ1zskKcUeNjyK6viy4Qff2ECy6RDYcLQ/MPlSxDRSyqbNyLG6hNxs335VCZf5qg3qtUtTFCYxDF8ufqOeDFB6gEX+/QL2k0JQ/Rv+Ry4a/e6Fx5fuXod1B3TiQn3X0G7tc6PXtOTqpJGjypyTx6MtQtHdHJ7tzEPcpr0UeKcQZ1057XwqD2ubG/JGSneajzDK1cfp7nabrJZ8g+Pblb9pnjBcLXv7NvpHFaTx1S6PpAYyTmOERZQs5LmGgqI0TohKYRr9thQLdD6sbuVW+1xriHSV1DH004w9PygmOZFyzWwAAAABJRU5ErkJggg==");
}
.link-url.one-pan-tip-lock[data-v-19f7b367]::before {
  content: '';
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABwUlEQVR4Xu1XvUoDQRA+0EoMub+oJBpv9wQLFSzsbASfwc4nsLMwcffERPEJbH0BQXwG2zQWEmttRIuA2Ch2Ohs4vMzueUncjRDug6/Zmdnvy85m99aycuQYIzi0XnWr9RU8/i/wKLv3aPTlUY4IY4S94HzjcEK+KptR0yH8HNcbgVNlm1g8iy5hj3ge7cCiom1OwC5LwcGcHTTs4kK04YcNyZxDDs/wXNoAe+qzR5DwZ5wTA1q4i83hHD0o7U33CIVHmUIu4afJGmhpC+f8GSBykRQpl5tTOEcF8QOMrhr8/d/jycUewvE0uJRfGTUGAm3YYy1BWL07HE9Dkda24zowpr+VRuCFx93NaoIujTpYry/Asj8ke2yE8/sVrJsJ6O2HNJFmwgW+hnUzMZix7oX8ChygxrQxdATMED4r5aTQqLFChXlSLWE3OE9Fo8Ysa2dCruUM56lo1Jgd8HVc61L2hvNUNGpM0LK2JuM6OOmvcTyNxo1B7m1c5y81FXE1c2MCubH++PPk8sXFL8XVHIEx+PztvhX5Ex7/jSMxNgyHMgbnUQdPpJs2iRaxbib85VpB/YzXQz880f8dnyPHuOIbV69cHR4KWOMAAAAASUVORK5CYII=");
}
.extract-code-container[data-v-19f7b367] {
  display: flex;
  background: #ffffff;
  align-items: center;
  gap: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
}
.extract-code-container code[data-v-19f7b367] {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  cursor: pointer;
  background: #eaeaea;
  padding: 2px 6px;
  border-radius: 6px;
  color: #3d3d3d;
}
.extract-code-container code[data-v-19f7b367]:hover {
  background: #e6e6e6;
}
.copy-btn[data-v-19f7b367] {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 3px;
}
.copy-btn[data-v-19f7b367]:hover {
  background: #f8f9fa;
}
.link-actions[data-v-19f7b367] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.vote-section[data-v-19f7b367] {
  display: flex;
  align-items: center;
  gap: 10px;
}
.vote-btn[data-v-19f7b367] {
  background: transparent;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.vote-icon[data-v-19f7b367] {
  width: 12px;
  height: 12px;
}
.vote-icon.down-icon[data-v-19f7b367] {
  transform: rotate(180deg);
}
.vote-btn[data-v-19f7b367]:hover:not(:disabled) {
  background: #e9ecef;
}
.vote-btn[data-v-19f7b367]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.vote-btn.active.up[data-v-19f7b367] {
  /* background: #d4edda;
  border-color: #c3e6cb; */
  color: #155724;
}
.vote-btn.active.down[data-v-19f7b367] {
  /* background: #f8d7da;
  border-color: #f5c6cb; */
  color: #721c24;
}
.vote-btn.pending[data-v-19f7b367] {
  opacity: 0.7;
  position: relative;
}
.pending-indicator[data-v-19f7b367] {
  font-size: 10px;
  margin-left: 2px;
  animation: pulse-19f7b367 1.5s ease-in-out infinite;
}
@keyframes pulse-19f7b367 {
0%,
  100% {
    opacity: 1;
}
50% {
    opacity: 0.5;
}
}
.action-buttons[data-v-19f7b367] {
  display: flex;
  gap: 8px;
}
.action-buttons button[data-v-19f7b367] {
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.edit-btn[data-v-19f7b367] {
  background: #ffc107;
  color: #212529;
}
.edit-btn[data-v-19f7b367]:hover {
  background: #e0a800;
}
.modify-btn[data-v-19f7b367] {
  width: 48px;
  height: 28px;
  background: #d4ecef66;
  color: rgb(34, 137, 155);
}
.modify-btn[data-v-19f7b367]:hover {
  background: #d4ecef80;
}
.delete-btn[data-v-19f7b367] {
  width: 48px;
  height: 28px;
  background: #ffccd052;
  color: rgb(230, 46, 46);
}
.delete-btn[data-v-19f7b367]:hover {
  background: #ffccd060;
}

/* 删除确认弹窗样式 */
.delete-confirmation[data-v-19f7b367] {
  text-align: center;
  padding: 20px 0;
}
.warning-icon[data-v-19f7b367] {
  font-size: 48px;
  margin-bottom: 16px;
}
.delete-confirmation p[data-v-19f7b367] {
  margin: 8px 0;
  font-size: 16px;
}
.warning-text[data-v-19f7b367] {
  color: #dc3545;
  font-size: 14px;
  font-weight: 500;
}
.delete-confirm-btn[data-v-19f7b367] {
  background: #f8d7da !important;
  color: #dc3545 !important;
  border: 1px solid #f5c6cb !important;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-weight: 500;
}
.delete-confirm-btn[data-v-19f7b367]:hover:not(:disabled) {
  background: #f8d7dad2 !important;
  border: 1px solid #f5c6cb !important;
}
.delete-confirm-btn[data-v-19f7b367]:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
.report-btn[data-v-19f7b367] {
  /* width: px; */
  height: 28px;
  background: #ffffff;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
}
.report-btn[data-v-19f7b367]:hover {
  color: #495057;
  background: #ededed;
}
.link-footer[data-v-19f7b367] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  padding-bottom: 15px;
}
.footer-left[data-v-19f7b367] {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-right[data-v-19f7b367] {
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer-right  span[data-v-19f7b367]{
 width: unset;
}
.original-link[data-v-19f7b367] {
  color: #007bff;
  text-decoration: none;
  font-size: 12px;
}
.original-link[data-v-19f7b367]:hover {
  background-color: transparent;
  /* text-decoration: underline; */
}
.report-count[data-v-19f7b367] {
  color: #dc3545;
  font-weight: bold;
}
.empty-state[data-v-19f7b367] {
  text-align: center;
  padding: 40px;
  padding-top: 0px;
  padding-bottom: 0px;
  color: #666;
}
.empty-state-icon[data-v-19f7b367] {
  display: block;
  margin: 0 auto;
  width: 40px;
  height: 40px;
}
.loading[data-v-19f7b367] {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* 顶部弹出式提示样式 */
.error-message[data-v-19f7b367] {
  background: #f8d7da;
  color: #721c24;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #f5c6cb;
}
.success-message[data-v-19f7b367] {
  background: #d4edda;
  color: #155724;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #c3e6cb;
}
@media (max-width: 768px) {
.link-manager[data-v-19f7b367] {
    padding: 10px;
}
.form-row[data-v-19f7b367] {
    flex-direction: column;
    gap: 10px;
}
.filter-bar[data-v-19f7b367] {
    flex-direction: column;
    gap: 8px;
}
.link-header[data-v-19f7b367] {
    flex-wrap: wrap;
}
.link-meta[data-v-19f7b367] {
    margin-left: 0;
    margin-top: 5px;
}
.link-actions[data-v-19f7b367] {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
}
}

/* 模态窗口样式 */
.modal-overlay[data-v-19f7b367] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(249, 249, 249, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content[data-v-19f7b367] {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.modal-header[data-v-19f7b367] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.modal-header h4[data-v-19f7b367] {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}
.close-btn[data-v-19f7b367] {
  background: #f5f5f5;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}
.close-btn[data-v-19f7b367]:hover {
  background: #eee;
  color: #333;
}
.header-submit-btn[data-v-19f7b367] {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}
.header-submit-btn[data-v-19f7b367]:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}
.header-submit-btn[data-v-19f7b367]:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  transform: none;
}
.modal-body[data-v-19f7b367] {
  padding: 0 20px 20px 20px;
}
.vote-section[data-v-19f7b367] {
  width: 100%;
}

/* 反馈表单样式 */
.input-wrapper textarea[data-v-19f7b367] {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  background: transparent;
}
.input-wrapper[data-v-19f7b367]:has(textarea):focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
.input-wrapper textarea[data-v-19f7b367]::placeholder {
  color: #999;
}


/* 分页样式 */
.pagination[data-v-19f7b367] {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  padding: 10px 10px 0px 10px;
  background: #ffffff;
  border-radius: 8px;
}
.pagination-btn[data-v-19f7b367] {
  box-shadow: rgba(0, 0, 0, 0.03) 4px 4px 20px 0px;
  padding: 8px 16px;
  border: 1px solid rgb(242, 242, 242);
  background: white;
  color: #333;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.pagination-btn[data-v-19f7b367]:hover:not(:disabled) {
  background: #b3d8ff;
  color: #007bff;
  border-color: #b3d8ff;
}
.pagination-btn[data-v-19f7b367]:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  border-color: #ddd;
}
.pagination-info[data-v-19f7b367] {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 登录提示样式 */
.login-prompt[data-v-19f7b367] {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  margin: 20px 0;
}
.login-prompt-content[data-v-19f7b367] {
  text-align: center;
  max-width: 400px;
}
.login-icon[data-v-19f7b367] {
  margin-bottom: 20px;
  color: #6c757d;
  opacity: 0.8;
}
.login-prompt h3[data-v-19f7b367] {
  font-size: 24px;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 10px;
}
.login-prompt p[data-v-19f7b367] {
  color: #6c757d;
  margin-bottom: 24px;
  font-size: 16px;
}
.login-btn[data-v-19f7b367] {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.2);
}
.login-btn[data-v-19f7b367]:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 123, 255, 0.25);
}
.login-btn[data-v-19f7b367]:active {
  transform: translateY(0);
}

/* 求资源相关样式 */
.seek-resource-section[data-v-19f7b367] {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.seek-btn[data-v-19f7b367] {
  padding: 10px 24px;
  background-color: #e6f2ff;
  color: #007bff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.seek-btn[data-v-19f7b367]:hover:not(:disabled) {
  background-color: #d0e8ff;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}
.seek-btn[data-v-19f7b367]:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}
.seek-btn.active[data-v-19f7b367] {
  background-color: #e6ffed;
  color: #28a745;
  cursor: default;
  box-shadow: none;
  animation: success-pulse-19f7b367 0.6s ease-out;
}
.seek-btn[data-v-19f7b367]:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
}

/* Loading Spinner */
.spinner[data-v-19f7b367] {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin-19f7b367 0.8s linear infinite;
}
@keyframes spin-19f7b367 {
to { transform: rotate(360deg);
}
}
@keyframes success-pulse-19f7b367 {
0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
}
50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
}
100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
}
}
.seek-count[data-v-19f7b367] {
  font-size: 13px;
  color: #666;
  margin: 0;
}
.seek-confirmation[data-v-19f7b367] {
  text-align: center;
  padding: 20px 0;
}
.seek-confirmation .info-icon[data-v-19f7b367] {
  font-size: 48px;
  margin-bottom: 16px;
}
.seek-confirmation p[data-v-19f7b367] {
  margin: 8px 0;
  color: #333;
  font-size: 16px;
}
.seek-confirmation .info-text[data-v-19f7b367] {
  font-size: 14px;
  color: #666;
}
.seek-confirm-btn[data-v-19f7b367] {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.seek-confirm-btn[data-v-19f7b367]:hover:not(:disabled) {
  background-color: #0056b3;
}
.seek-confirm-btn[data-v-19f7b367]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* URL预览样式 */
.url-preview[data-v-19f7b367] {
  display: none;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}
.url-preview-label[data-v-19f7b367] {
  display: block;
  font-size: 11px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}
.url-preview-text[data-v-19f7b367] {
  display: block;
  font-size: 12px;
  color: #333;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  line-height: 1.4;
}

/* 弹窗动画 */
.modal-enter-active[data-v-19f7b367],
.modal-leave-active[data-v-19f7b367] {
  transition: opacity 0.3s ease;
}
.modal-enter-from[data-v-19f7b367],
.modal-leave-to[data-v-19f7b367] {
  opacity: 0;
}
.modal-enter-active .modal-content[data-v-19f7b367],
.modal-leave-active .modal-content[data-v-19f7b367] {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from .modal-content[data-v-19f7b367],
.modal-leave-to .modal-content[data-v-19f7b367] {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.auth-switch[data-v-d47a81a4] {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.switch-container[data-v-d47a81a4] {
  position: relative;
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
  width: 200px;
  height: 30px;
}
.switch-input[data-v-d47a81a4] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.switch-label[data-v-d47a81a4] {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 2;
  position: relative;
}
.switch-input:checked + .switch-label[data-v-d47a81a4] {
  color: #007bff;
}
.slider[data-v-d47a81a4] {
  position: absolute;
  top: 4px;
  left: 0;
  width: 46%;
  height: calc(100% - 8px);
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 1;
}

/* 悬停效果 */
.switch-label[data-v-d47a81a4]:hover {
  color: #007bff;
}

/* 激活状态的标签保持蓝色 */
.switch-input:checked + .switch-label[data-v-d47a81a4] {
  color: #007bff;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
.switch-container[data-v-d47a81a4] {
    width: 180px;
    height: 36px;
}
.switch-label[data-v-d47a81a4] {
    font-size: 13px;
}
}

.auth-container[data-v-798c14d2] {
  padding: 16px;
}

/* 用户信息样式 */
.user-info[data-v-798c14d2] {
  text-align: center;
}
.user-header[data-v-798c14d2] {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
}
.user-avatar[data-v-798c14d2] {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  margin-right: 12px;
}
.user-details[data-v-798c14d2] {
  flex: 1;
  text-align: left;
}
.user-display-name[data-v-798c14d2] {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}
.user-email[data-v-798c14d2] {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}
.user-status[data-v-798c14d2] {
  font-size: 12px;
  color: #28a745;
}

/* 用户统计样式 */
.user-stats[data-v-798c14d2] {
  margin-top: 8px;
  display: flex;
  gap: 16px;
}
.stat-item[data-v-798c14d2] {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.stat-icon[data-v-798c14d2] {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
}
.stat-icon.down-icon[data-v-798c14d2] {
  color: #868686;
  transform: rotate(180deg);
}
.stat-icon svg[data-v-798c14d2] {
  width: 100%;
  height: 100%;
}
.stat-label[data-v-798c14d2] {
  color: #666;
  font-weight: 500;
}
.stat-value[data-v-798c14d2] {
  color: #333;
  font-weight: 600;
  background: #f8f9f0;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}
.edit-nickname-btn[data-v-798c14d2] {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}
.edit-nickname-btn[data-v-798c14d2]:hover {
  background: #e8f5ff;
}

/* 昵称编辑表单样式 */
.nickname-edit-form[data-v-798c14d2] {
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
.nickname-edit-form .form-group[data-v-798c14d2] {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.nickname-edit-form .form-group label[data-v-798c14d2] {
  text-align: left;
  min-width: auto;
  margin-bottom: 2px;
}
.nickname-hint[data-v-798c14d2] {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}
.nickname-actions[data-v-798c14d2] {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.save-nickname-btn[data-v-798c14d2] {
  padding: 6px 12px;
  background: #beecc859;
  color: #2e8339;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}
.save-nickname-btn[data-v-798c14d2]:hover:not(:disabled) {
  background: #cef3d6;
}
.save-nickname-btn[data-v-798c14d2]:disabled {
  background: #cef3d6;
  cursor: not-allowed;
}
.cancel-nickname-btn[data-v-798c14d2] {
  padding: 6px 12px;
  background: #f1f1f1;
  color: #828282;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}
.cancel-nickname-btn[data-v-798c14d2]:hover {
  background: #e4e4e4;
}
.sign-out-btn[data-v-798c14d2] {
  width: 100%;
  padding: 8px 16px;
  background: #ffe4e6;
  color: #ff3333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}
.sign-out-btn[data-v-798c14d2]:hover {
  background: #ffedef;
}

/* 认证表单样式 */
.auth-forms[data-v-798c14d2] {
  width: 100%;
}
.auth-form[data-v-798c14d2] {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 默认表单组样式（注册表单使用左右布局） */
.form-group[data-v-798c14d2] {
  display: flex;
  align-items: center;
  gap: 6px;
}
.form-group label[data-v-798c14d2] {
  font-size: 12px;
  color: #333;
  margin-bottom: 0;
  font-weight: 500;
  white-space: nowrap;
  min-width: 50px;
  text-align: right;
}

/* 登录表单使用上下布局 */
.auth-form[data-mode="login"] .form-group[data-v-798c14d2] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.auth-form[data-mode="login"] .form-group label[data-v-798c14d2] {
  text-align: left;
  min-width: auto;
  margin-bottom: 2px;
}

/* 登录表单的input包装器样式 */
.auth-form[data-mode="login"] .input-wrapper[data-v-798c14d2] {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.2s;
}
.auth-form[data-mode="login"] .input-wrapper[data-v-798c14d2]:focus-within {
  border-color: none;
  box-shadow: none;
}

/* 登录表单的input样式 */
.auth-form[data-mode="login"] .form-input[data-v-798c14d2] {
  width: 95%;
  margin: 8px;
  padding: 0;
  border: none;
  border-radius: 0;
  font-size: 13px;
  background: transparent;
  outline: none;
}
.auth-form[data-mode="login"] .form-input[data-v-798c14d2]:focus {
  border-color: none;
  box-shadow: none;
}
.form-input[data-v-798c14d2] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  transition: border-color 0.2s;
}
.form-input[data-v-798c14d2]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

/* 注册表单的 input wrapper 样式 */
.auth-form[data-mode="register"] .input-wrapper[data-v-798c14d2] {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

/* 确保注册表单中的输入框填满 wrapper */
.auth-form[data-mode="register"] .form-input[data-v-798c14d2] {
  width: 100%;
}

/* 带图标的输入框样式 */
.form-input.with-icon[data-v-798c14d2] {
  padding-right: 32px; /* 为图标留出空间 */
}

/* 眼睛图标按钮样式 */
.eye-btn[data-v-798c14d2] {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  z-index: 2;
  transition: color 0.2s;
}
.eye-btn[data-v-798c14d2]:hover {
  color: #666;
}
.auth-submit-btn[data-v-798c14d2] {
  margin-top: 8px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s;
}
.auth-submit-btn[data-v-798c14d2]:hover:not(:disabled) {
  background: #0056b3;
}
.auth-submit-btn[data-v-798c14d2]:disabled {
  background: #80bdff;
  cursor: not-allowed;
}
.forgot-password-link[data-v-798c14d2] {
  text-align: center;
  margin-top: 15px;
}
.link-btn[data-v-798c14d2] {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  padding: 0;
}
.link-btn[data-v-798c14d2]:hover {
  color: #0056b3;
}
.link-btn[data-v-798c14d2]:disabled {
  color: #6c757d;
  cursor: not-allowed;
  text-decoration: none;
}
.back-button[data-v-798c14d2] {
  margin-bottom: 20px;
}
.back-btn[data-v-798c14d2] {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 5px;
}
.back-btn[data-v-798c14d2]:hover {
  color: #495057;
}
.form-title[data-v-798c14d2] {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #333;
}
.form-description[data-v-798c14d2] {
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.5;
}
.proof-progress[data-v-798c14d2] {
  margin: 20px 0;
}
.progress-text[data-v-798c14d2] {
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 10px;
}
.progress-bar[data-v-798c14d2] {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill[data-v-798c14d2] {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
  border-radius: 4px;
}
.resend-code[data-v-798c14d2] {
  text-align: center;
  margin-top: 15px;
}

/* 消息样式 */
.error-message[data-v-798c14d2] {
  padding: 8px 12px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 12px;
}
.success-message[data-v-798c14d2] {
  padding: 8px 12px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 12px;
}

/* 初始化加载样式 */
.initializing-container[data-v-798c14d2] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.initializing-container .loading-spinner[data-v-798c14d2] {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin-798c14d2 1s linear infinite;
  margin-bottom: 16px;
}
.initializing-container p[data-v-798c14d2] {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}
@keyframes spin-798c14d2 {
0% { transform: rotate(0deg);
}
100% { transform: rotate(360deg);
}
}

/* 顶部弹出式提示样式 */
.about-section[data-v-798c14d2] {
  margin-top: 12px;
  text-align: center;
}
.about-link[data-v-798c14d2] {
  font-size: 12px;
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
}
.about-link[data-v-798c14d2]:hover {
  color: #007bff;
  text-decoration: underline;
  background-color: #f8f9fa;
}

.debug-panel[data-v-dba5723e] {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background: white;
  border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  z-index: 10000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-y: auto;
}
.debug-header[data-v-dba5723e] {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.debug-header h3[data-v-dba5723e] {
  margin: 0;
  font-size: 16px;
}
.close-btn[data-v-dba5723e] {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.debug-content[data-v-dba5723e] {
  padding: 15px;
}
.debug-section[data-v-dba5723e] {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.debug-section[data-v-dba5723e]:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.debug-section h4[data-v-dba5723e] {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}
.debug-section h5[data-v-dba5723e] {
  margin: 10px 0 5px 0;
  color: #666;
  font-size: 12px;
}
.status-item[data-v-dba5723e] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}
.label[data-v-dba5723e] {
  font-weight: bold;
  color: #555;
}
.value[data-v-dba5723e] {
  color: #333;
  max-width: 200px;
  word-break: break-all;
}
.token[data-v-dba5723e] {
  font-family: monospace;
  font-size: 10px;
}
.status[data-v-dba5723e] {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}
.status.success[data-v-dba5723e] {
  background: #d4edda;
  color: #155724;
}
.status.error[data-v-dba5723e] {
  background: #f8d7da;
  color: #721c24;
}
.button-group[data-v-dba5723e] {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.debug-btn[data-v-dba5723e] {
  padding: 6px 12px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}
.debug-btn[data-v-dba5723e]:hover {
  background: #007bff;
  color: white;
}
.debug-btn.danger[data-v-dba5723e] {
  border-color: #dc3545;
  color: #dc3545;
}
.debug-btn.danger[data-v-dba5723e]:hover {
  background: #dc3545;
  color: white;
}
.test-result[data-v-dba5723e] {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
}
.test-result pre[data-v-dba5723e] {
  margin: 0;
  font-size: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}
.headers-preview[data-v-dba5723e] {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
}
.headers-preview code[data-v-dba5723e] {
  font-size: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}

.update-notification-overlay[data-v-8ddffaa9] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(2px);
}
.update-notification[data-v-8ddffaa9] {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn-8ddffaa9 0.3s ease-out;
}
@keyframes slideIn-8ddffaa9 {
from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
}
to {
    opacity: 1;
    transform: scale(1) translateY(0);
}
}
.notification-header[data-v-8ddffaa9] {
  display: flex;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}
.header-icon[data-v-8ddffaa9] {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: #e8f5e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}
.header-content[data-v-8ddffaa9] {
  flex: 1;
}
.notification-title[data-v-8ddffaa9] {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}
.notification-subtitle[data-v-8ddffaa9] {
  font-size: 14px;
  color: #666;
  margin: 0;
}
.close-btn[data-v-8ddffaa9] {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}
.close-btn[data-v-8ddffaa9]:hover {
  background: #e0e0e0;
  color: #333;
}
.version-info[data-v-8ddffaa9] {
  padding: 16px 24px;
  background: #f8f9fa;
  margin: 0 24px;
  border-radius: 8px;
  margin-top: 16px;
}
.version-row[data-v-8ddffaa9] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.version-row[data-v-8ddffaa9]:last-child {
  margin-bottom: 0;
}
.version-label[data-v-8ddffaa9] {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
.version-current[data-v-8ddffaa9] {
  font-size: 14px;
  color: #666;
  font-family: monospace;
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 4px;
}
.version-latest[data-v-8ddffaa9] {
  font-size: 14px;
  color: #4CAF50;
  font-family: monospace;
  font-weight: 600;
  background: #e8f5e8;
  padding: 2px 8px;
  border-radius: 4px;
}
.update-description[data-v-8ddffaa9] {
  padding: 16px 24px;
}
.description-title[data-v-8ddffaa9] {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.description-title[data-v-8ddffaa9]::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #4CAF50;
  border-radius: 2px;
}
.description-content[data-v-8ddffaa9] {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}
.notification-actions[data-v-8ddffaa9] {
  padding: 16px 24px 24px;
}
.skip-option[data-v-8ddffaa9] {
  margin-bottom: 16px;
}
.skip-checkbox[data-v-8ddffaa9] {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}
.skip-checkbox input[type="checkbox"][data-v-8ddffaa9] {
  display: none;
}
.checkmark[data-v-8ddffaa9] {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s ease;
}
.skip-checkbox input[type="checkbox"]:checked + .checkmark[data-v-8ddffaa9] {
  background: #4CAF50;
  border-color: #4CAF50;
}
.skip-checkbox input[type="checkbox"]:checked + .checkmark[data-v-8ddffaa9]::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.skip-text[data-v-8ddffaa9] {
  user-select: none;
}
.action-buttons[data-v-8ddffaa9] {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.btn[data-v-8ddffaa9] {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: center;
}
.btn[data-v-8ddffaa9]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.btn-secondary[data-v-8ddffaa9] {
  background: #f5f5f5;
  color: #666;
}
.btn-secondary[data-v-8ddffaa9]:hover:not(:disabled) {
  background: #e0e0e0;
  color: #333;
}
.btn-primary[data-v-8ddffaa9] {
  background: #4CAF50;
  color: white;
}
.btn-primary[data-v-8ddffaa9]:hover:not(:disabled) {
  background: #45a049;
}
.loading-spinner[data-v-8ddffaa9] {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin-8ddffaa9 1s linear infinite;
}
@keyframes spin-8ddffaa9 {
0% { transform: rotate(0deg);
}
100% { transform: rotate(360deg);
}
}
.update-note[data-v-8ddffaa9] {
  padding: 0 24px 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
  padding-top: 16px;
}
.note-text[data-v-8ddffaa9] {
  font-size: 12px;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 480px) {
.update-notification[data-v-8ddffaa9] {
    width: 95%;
    margin: 20px;
}
.notification-header[data-v-8ddffaa9] {
    padding: 20px 20px 16px;
}
.version-info[data-v-8ddffaa9],
  .update-description[data-v-8ddffaa9],
  .notification-actions[data-v-8ddffaa9],
  .update-note[data-v-8ddffaa9] {
    padding-left: 20px;
    padding-right: 20px;
}
.action-buttons[data-v-8ddffaa9] {
    flex-direction: column;
}
.btn[data-v-8ddffaa9] {
    width: 100%;
}
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
.update-notification[data-v-8ddffaa9] {
    background: #2d3748;
    color: #e2e8f0;
}
.notification-header[data-v-8ddffaa9] {
    border-bottom-color: #4a5568;
}
.notification-title[data-v-8ddffaa9] {
    color: #e2e8f0;
}
.notification-subtitle[data-v-8ddffaa9] {
    color: #a0aec0;
}
.close-btn[data-v-8ddffaa9] {
    background: #4a5568;
    color: #a0aec0;
}
.close-btn[data-v-8ddffaa9]:hover {
    background: #718096;
    color: #e2e8f0;
}
.version-info[data-v-8ddffaa9] {
    background: #4a5568;
}
.version-current[data-v-8ddffaa9] {
    background: #718096;
    color: #e2e8f0;
}
.version-latest[data-v-8ddffaa9] {
    background: #2f855a;
    color: #c6f6d5;
}
.update-description p[data-v-8ddffaa9] {
    color: #cbd5e0;
}
.description-title[data-v-8ddffaa9] {
    color: #e2e8f0;
}
.description-content[data-v-8ddffaa9] {
    color: #cbd5e0;
    background: #4a5568;
}
.skip-checkbox[data-v-8ddffaa9] {
    color: #a0aec0;
}
.checkmark[data-v-8ddffaa9] {
    border-color: #718096;
}
.btn-secondary[data-v-8ddffaa9] {
    background: #4a5568;
    color: #a0aec0;
}
.btn-secondary[data-v-8ddffaa9]:hover:not(:disabled) {
    background: #718096;
    color: #e2e8f0;
}
.update-note[data-v-8ddffaa9] {
    border-top-color: #4a5568;
}
.note-text[data-v-8ddffaa9] {
    color: #a0aec0;
}
}
`;
    document.head.appendChild(style);
})();

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
// @license      MIT
(function() {
  "use strict";
  (function() {
    "use strict";
    /**
    * @vue/shared v3.5.18
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    /*! #__NO_SIDE_EFFECTS__ */
    // @__NO_SIDE_EFFECTS__
    function makeMap(str) {
      const map = /* @__PURE__ */ Object.create(null);
      for (const key of str.split(",")) map[key] = 1;
      return (val) => val in map;
    }
    const EMPTY_OBJ = {};
    const EMPTY_ARR = [];
    const NOOP = () => {
    };
    const NO = () => false;
    const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
    (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
    const isModelListener = (key) => key.startsWith("onUpdate:");
    const extend = Object.assign;
    const remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
    const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
    const isArray = Array.isArray;
    const isMap = (val) => toTypeString(val) === "[object Map]";
    const isSet = (val) => toTypeString(val) === "[object Set]";
    const isDate = (val) => toTypeString(val) === "[object Date]";
    const isFunction = (val) => typeof val === "function";
    const isString = (val) => typeof val === "string";
    const isSymbol = (val) => typeof val === "symbol";
    const isObject = (val) => val !== null && typeof val === "object";
    const isPromise = (val) => {
      return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
    };
    const objectToString = Object.prototype.toString;
    const toTypeString = (value) => objectToString.call(value);
    const toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    const isPlainObject = (val) => toTypeString(val) === "[object Object]";
    const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    const isReservedProp = /* @__PURE__ */ makeMap(
      // the leading comma is intentional so empty string "" is also included
      ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
    );
    const cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    const camelizeRE = /-(\w)/g;
    const camelize = cacheStringFunction(
      (str) => {
        return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
      }
    );
    const hyphenateRE = /\B([A-Z])/g;
    const hyphenate = cacheStringFunction(
      (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
    );
    const capitalize = cacheStringFunction((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
    const toHandlerKey = cacheStringFunction(
      (str) => {
        const s = str ? `on${capitalize(str)}` : ``;
        return s;
      }
    );
    const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
    const invokeArrayFns = (fns, ...arg) => {
      for (let i = 0; i < fns.length; i++) {
        fns[i](...arg);
      }
    };
    const def = (obj, key, value, writable = false) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        writable,
        value
      });
    };
    const looseToNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
    };
    const toNumber = (val) => {
      const n = isString(val) ? Number(val) : NaN;
      return isNaN(n) ? val : n;
    };
    let _globalThis;
    const getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    function normalizeStyle(value) {
      if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
          if (normalized) {
            for (const key in normalized) {
              res[key] = normalized[key];
            }
          }
        }
        return res;
      } else if (isString(value) || isObject(value)) {
        return value;
      }
    }
    const listDelimiterRE = /;(?![^(]*\))/g;
    const propertyDelimiterRE = /:([^]+)/;
    const styleCommentRE = /\/\*[^]*?\*\//g;
    function parseStringStyle(cssText) {
      const ret = {};
      cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
        if (item) {
          const tmp = item.split(propertyDelimiterRE);
          tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return ret;
    }
    function normalizeClass(value) {
      let res = "";
      if (isString(value)) {
        res = value;
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i]);
          if (normalized) {
            res += normalized + " ";
          }
        }
      } else if (isObject(value)) {
        for (const name in value) {
          if (value[name]) {
            res += name + " ";
          }
        }
      }
      return res.trim();
    }
    const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
    function includeBooleanAttr(value) {
      return !!value || value === "";
    }
    function looseCompareArrays(a, b) {
      if (a.length !== b.length) return false;
      let equal = true;
      for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
      }
      return equal;
    }
    function looseEqual(a, b) {
      if (a === b) return true;
      let aValidType = isDate(a);
      let bValidType = isDate(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
      }
      aValidType = isSymbol(a);
      bValidType = isSymbol(b);
      if (aValidType || bValidType) {
        return a === b;
      }
      aValidType = isArray(a);
      bValidType = isArray(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
      }
      aValidType = isObject(a);
      bValidType = isObject(b);
      if (aValidType || bValidType) {
        if (!aValidType || !bValidType) {
          return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
          return false;
        }
        for (const key in a) {
          const aHasKey = a.hasOwnProperty(key);
          const bHasKey = b.hasOwnProperty(key);
          if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
            return false;
          }
        }
      }
      return String(a) === String(b);
    }
    function looseIndexOf(arr, val) {
      return arr.findIndex((item) => looseEqual(item, val));
    }
    const isRef$1 = (val) => {
      return !!(val && val["__v_isRef"] === true);
    };
    const toDisplayString = (val) => {
      return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
    };
    const replacer = (_key, val) => {
      if (isRef$1(val)) {
        return replacer(_key, val.value);
      } else if (isMap(val)) {
        return {
          [`Map(${val.size})`]: [...val.entries()].reduce(
            (entries, [key, val2], i) => {
              entries[stringifySymbol(key, i) + " =>"] = val2;
              return entries;
            },
            {}
          )
        };
      } else if (isSet(val)) {
        return {
          [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
        };
      } else if (isSymbol(val)) {
        return stringifySymbol(val);
      } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
      }
      return val;
    };
    const stringifySymbol = (v, i = "") => {
      var _a;
      return (
        // Symbol.description in es2019+ so we need to cast here to pass
        // the lib: es2016 check
        isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
      );
    };
    /**
    * @vue/reactivity v3.5.18
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    let activeEffectScope;
    class EffectScope {
      constructor(detached = false) {
        this.detached = detached;
        this._active = true;
        this._on = 0;
        this.effects = [];
        this.cleanups = [];
        this._isPaused = false;
        this.parent = activeEffectScope;
        if (!detached && activeEffectScope) {
          this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
            this
          ) - 1;
        }
      }
      get active() {
        return this._active;
      }
      pause() {
        if (this._active) {
          this._isPaused = true;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].pause();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].pause();
          }
        }
      }
      /**
       * Resumes the effect scope, including all child scopes and effects.
       */
      resume() {
        if (this._active) {
          if (this._isPaused) {
            this._isPaused = false;
            let i, l;
            if (this.scopes) {
              for (i = 0, l = this.scopes.length; i < l; i++) {
                this.scopes[i].resume();
              }
            }
            for (i = 0, l = this.effects.length; i < l; i++) {
              this.effects[i].resume();
            }
          }
        }
      }
      run(fn) {
        if (this._active) {
          const currentEffectScope = activeEffectScope;
          try {
            activeEffectScope = this;
            return fn();
          } finally {
            activeEffectScope = currentEffectScope;
          }
        }
      }
      /**
       * This should only be called on non-detached scopes
       * @internal
       */
      on() {
        if (++this._on === 1) {
          this.prevScope = activeEffectScope;
          activeEffectScope = this;
        }
      }
      /**
       * This should only be called on non-detached scopes
       * @internal
       */
      off() {
        if (this._on > 0 && --this._on === 0) {
          activeEffectScope = this.prevScope;
          this.prevScope = void 0;
        }
      }
      stop(fromParent) {
        if (this._active) {
          this._active = false;
          let i, l;
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].stop();
          }
          this.effects.length = 0;
          for (i = 0, l = this.cleanups.length; i < l; i++) {
            this.cleanups[i]();
          }
          this.cleanups.length = 0;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].stop(true);
            }
            this.scopes.length = 0;
          }
          if (!this.detached && this.parent && !fromParent) {
            const last = this.parent.scopes.pop();
            if (last && last !== this) {
              this.parent.scopes[this.index] = last;
              last.index = this.index;
            }
          }
          this.parent = void 0;
        }
      }
    }
    function getCurrentScope() {
      return activeEffectScope;
    }
    let activeSub;
    const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
    class ReactiveEffect {
      constructor(fn) {
        this.fn = fn;
        this.deps = void 0;
        this.depsTail = void 0;
        this.flags = 1 | 4;
        this.next = void 0;
        this.cleanup = void 0;
        this.scheduler = void 0;
        if (activeEffectScope && activeEffectScope.active) {
          activeEffectScope.effects.push(this);
        }
      }
      pause() {
        this.flags |= 64;
      }
      resume() {
        if (this.flags & 64) {
          this.flags &= -65;
          if (pausedQueueEffects.has(this)) {
            pausedQueueEffects.delete(this);
            this.trigger();
          }
        }
      }
      /**
       * @internal
       */
      notify() {
        if (this.flags & 2 && !(this.flags & 32)) {
          return;
        }
        if (!(this.flags & 8)) {
          batch(this);
        }
      }
      run() {
        if (!(this.flags & 1)) {
          return this.fn();
        }
        this.flags |= 2;
        cleanupEffect(this);
        prepareDeps(this);
        const prevEffect = activeSub;
        const prevShouldTrack = shouldTrack;
        activeSub = this;
        shouldTrack = true;
        try {
          return this.fn();
        } finally {
          cleanupDeps(this);
          activeSub = prevEffect;
          shouldTrack = prevShouldTrack;
          this.flags &= -3;
        }
      }
      stop() {
        if (this.flags & 1) {
          for (let link = this.deps; link; link = link.nextDep) {
            removeSub(link);
          }
          this.deps = this.depsTail = void 0;
          cleanupEffect(this);
          this.onStop && this.onStop();
          this.flags &= -2;
        }
      }
      trigger() {
        if (this.flags & 64) {
          pausedQueueEffects.add(this);
        } else if (this.scheduler) {
          this.scheduler();
        } else {
          this.runIfDirty();
        }
      }
      /**
       * @internal
       */
      runIfDirty() {
        if (isDirty(this)) {
          this.run();
        }
      }
      get dirty() {
        return isDirty(this);
      }
    }
    let batchDepth = 0;
    let batchedSub;
    let batchedComputed;
    function batch(sub, isComputed = false) {
      sub.flags |= 8;
      if (isComputed) {
        sub.next = batchedComputed;
        batchedComputed = sub;
        return;
      }
      sub.next = batchedSub;
      batchedSub = sub;
    }
    function startBatch() {
      batchDepth++;
    }
    function endBatch() {
      if (--batchDepth > 0) {
        return;
      }
      if (batchedComputed) {
        let e = batchedComputed;
        batchedComputed = void 0;
        while (e) {
          const next = e.next;
          e.next = void 0;
          e.flags &= -9;
          e = next;
        }
      }
      let error2;
      while (batchedSub) {
        let e = batchedSub;
        batchedSub = void 0;
        while (e) {
          const next = e.next;
          e.next = void 0;
          e.flags &= -9;
          if (e.flags & 1) {
            try {
              ;
              e.trigger();
            } catch (err) {
              if (!error2) error2 = err;
            }
          }
          e = next;
        }
      }
      if (error2) throw error2;
    }
    function prepareDeps(sub) {
      for (let link = sub.deps; link; link = link.nextDep) {
        link.version = -1;
        link.prevActiveLink = link.dep.activeLink;
        link.dep.activeLink = link;
      }
    }
    function cleanupDeps(sub) {
      let head;
      let tail = sub.depsTail;
      let link = tail;
      while (link) {
        const prev = link.prevDep;
        if (link.version === -1) {
          if (link === tail) tail = prev;
          removeSub(link);
          removeDep(link);
        } else {
          head = link;
        }
        link.dep.activeLink = link.prevActiveLink;
        link.prevActiveLink = void 0;
        link = prev;
      }
      sub.deps = head;
      sub.depsTail = tail;
    }
    function isDirty(sub) {
      for (let link = sub.deps; link; link = link.nextDep) {
        if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
          return true;
        }
      }
      if (sub._dirty) {
        return true;
      }
      return false;
    }
    function refreshComputed(computed2) {
      if (computed2.flags & 4 && !(computed2.flags & 16)) {
        return;
      }
      computed2.flags &= -17;
      if (computed2.globalVersion === globalVersion) {
        return;
      }
      computed2.globalVersion = globalVersion;
      if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
        return;
      }
      computed2.flags |= 2;
      const dep = computed2.dep;
      const prevSub = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = computed2;
      shouldTrack = true;
      try {
        prepareDeps(computed2);
        const value = computed2.fn(computed2._value);
        if (dep.version === 0 || hasChanged(value, computed2._value)) {
          computed2.flags |= 128;
          computed2._value = value;
          dep.version++;
        }
      } catch (err) {
        dep.version++;
        throw err;
      } finally {
        activeSub = prevSub;
        shouldTrack = prevShouldTrack;
        cleanupDeps(computed2);
        computed2.flags &= -3;
      }
    }
    function removeSub(link, soft = false) {
      const { dep, prevSub, nextSub } = link;
      if (prevSub) {
        prevSub.nextSub = nextSub;
        link.prevSub = void 0;
      }
      if (nextSub) {
        nextSub.prevSub = prevSub;
        link.nextSub = void 0;
      }
      if (dep.subs === link) {
        dep.subs = prevSub;
        if (!prevSub && dep.computed) {
          dep.computed.flags &= -5;
          for (let l = dep.computed.deps; l; l = l.nextDep) {
            removeSub(l, true);
          }
        }
      }
      if (!soft && !--dep.sc && dep.map) {
        dep.map.delete(dep.key);
      }
    }
    function removeDep(link) {
      const { prevDep, nextDep } = link;
      if (prevDep) {
        prevDep.nextDep = nextDep;
        link.prevDep = void 0;
      }
      if (nextDep) {
        nextDep.prevDep = prevDep;
        link.nextDep = void 0;
      }
    }
    let shouldTrack = true;
    const trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function cleanupEffect(e) {
      const { cleanup } = e;
      e.cleanup = void 0;
      if (cleanup) {
        const prevSub = activeSub;
        activeSub = void 0;
        try {
          cleanup();
        } finally {
          activeSub = prevSub;
        }
      }
    }
    let globalVersion = 0;
    class Link {
      constructor(sub, dep) {
        this.sub = sub;
        this.dep = dep;
        this.version = dep.version;
        this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
      }
    }
    class Dep {
      // TODO isolatedDeclarations "__v_skip"
      constructor(computed2) {
        this.computed = computed2;
        this.version = 0;
        this.activeLink = void 0;
        this.subs = void 0;
        this.map = void 0;
        this.key = void 0;
        this.sc = 0;
        this.__v_skip = true;
      }
      track(debugInfo) {
        if (!activeSub || !shouldTrack || activeSub === this.computed) {
          return;
        }
        let link = this.activeLink;
        if (link === void 0 || link.sub !== activeSub) {
          link = this.activeLink = new Link(activeSub, this);
          if (!activeSub.deps) {
            activeSub.deps = activeSub.depsTail = link;
          } else {
            link.prevDep = activeSub.depsTail;
            activeSub.depsTail.nextDep = link;
            activeSub.depsTail = link;
          }
          addSub(link);
        } else if (link.version === -1) {
          link.version = this.version;
          if (link.nextDep) {
            const next = link.nextDep;
            next.prevDep = link.prevDep;
            if (link.prevDep) {
              link.prevDep.nextDep = next;
            }
            link.prevDep = activeSub.depsTail;
            link.nextDep = void 0;
            activeSub.depsTail.nextDep = link;
            activeSub.depsTail = link;
            if (activeSub.deps === link) {
              activeSub.deps = next;
            }
          }
        }
        return link;
      }
      trigger(debugInfo) {
        this.version++;
        globalVersion++;
        this.notify(debugInfo);
      }
      notify(debugInfo) {
        startBatch();
        try {
          if (false) ;
          for (let link = this.subs; link; link = link.prevSub) {
            if (link.sub.notify()) {
              ;
              link.sub.dep.notify();
            }
          }
        } finally {
          endBatch();
        }
      }
    }
    function addSub(link) {
      link.dep.sc++;
      if (link.sub.flags & 4) {
        const computed2 = link.dep.computed;
        if (computed2 && !link.dep.subs) {
          computed2.flags |= 4 | 16;
          for (let l = computed2.deps; l; l = l.nextDep) {
            addSub(l);
          }
        }
        const currentTail = link.dep.subs;
        if (currentTail !== link) {
          link.prevSub = currentTail;
          if (currentTail) currentTail.nextSub = link;
        }
        link.dep.subs = link;
      }
    }
    const targetMap = /* @__PURE__ */ new WeakMap();
    const ITERATE_KEY = Symbol(
      ""
    );
    const MAP_KEY_ITERATE_KEY = Symbol(
      ""
    );
    const ARRAY_ITERATE_KEY = Symbol(
      ""
    );
    function track(target, type, key) {
      if (shouldTrack && activeSub) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
          targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
          depsMap.set(key, dep = new Dep());
          dep.map = depsMap;
          dep.key = key;
        }
        {
          dep.track();
        }
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        globalVersion++;
        return;
      }
      const run = (dep) => {
        if (dep) {
          {
            dep.trigger();
          }
        }
      };
      startBatch();
      if (type === "clear") {
        depsMap.forEach(run);
      } else {
        const targetIsArray = isArray(target);
        const isArrayIndex = targetIsArray && isIntegerKey(key);
        if (targetIsArray && key === "length") {
          const newLength = Number(newValue);
          depsMap.forEach((dep, key2) => {
            if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
              run(dep);
            }
          });
        } else {
          if (key !== void 0 || depsMap.has(void 0)) {
            run(depsMap.get(key));
          }
          if (isArrayIndex) {
            run(depsMap.get(ARRAY_ITERATE_KEY));
          }
          switch (type) {
            case "add":
              if (!targetIsArray) {
                run(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                  run(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              } else if (isArrayIndex) {
                run(depsMap.get("length"));
              }
              break;
            case "delete":
              if (!targetIsArray) {
                run(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                  run(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              }
              break;
            case "set":
              if (isMap(target)) {
                run(depsMap.get(ITERATE_KEY));
              }
              break;
          }
        }
      }
      endBatch();
    }
    function reactiveReadArray(array) {
      const raw = toRaw(array);
      if (raw === array) return raw;
      track(raw, "iterate", ARRAY_ITERATE_KEY);
      return isShallow(array) ? raw : raw.map(toReactive);
    }
    function shallowReadArray(arr) {
      track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
      return arr;
    }
    const arrayInstrumentations = {
      __proto__: null,
      [Symbol.iterator]() {
        return iterator(this, Symbol.iterator, toReactive);
      },
      concat(...args) {
        return reactiveReadArray(this).concat(
          ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
        );
      },
      entries() {
        return iterator(this, "entries", (value) => {
          value[1] = toReactive(value[1]);
          return value;
        });
      },
      every(fn, thisArg) {
        return apply(this, "every", fn, thisArg, void 0, arguments);
      },
      filter(fn, thisArg) {
        return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
      },
      find(fn, thisArg) {
        return apply(this, "find", fn, thisArg, toReactive, arguments);
      },
      findIndex(fn, thisArg) {
        return apply(this, "findIndex", fn, thisArg, void 0, arguments);
      },
      findLast(fn, thisArg) {
        return apply(this, "findLast", fn, thisArg, toReactive, arguments);
      },
      findLastIndex(fn, thisArg) {
        return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
      },
      // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
      forEach(fn, thisArg) {
        return apply(this, "forEach", fn, thisArg, void 0, arguments);
      },
      includes(...args) {
        return searchProxy(this, "includes", args);
      },
      indexOf(...args) {
        return searchProxy(this, "indexOf", args);
      },
      join(separator) {
        return reactiveReadArray(this).join(separator);
      },
      // keys() iterator only reads `length`, no optimisation required
      lastIndexOf(...args) {
        return searchProxy(this, "lastIndexOf", args);
      },
      map(fn, thisArg) {
        return apply(this, "map", fn, thisArg, void 0, arguments);
      },
      pop() {
        return noTracking(this, "pop");
      },
      push(...args) {
        return noTracking(this, "push", args);
      },
      reduce(fn, ...args) {
        return reduce(this, "reduce", fn, args);
      },
      reduceRight(fn, ...args) {
        return reduce(this, "reduceRight", fn, args);
      },
      shift() {
        return noTracking(this, "shift");
      },
      // slice could use ARRAY_ITERATE but also seems to beg for range tracking
      some(fn, thisArg) {
        return apply(this, "some", fn, thisArg, void 0, arguments);
      },
      splice(...args) {
        return noTracking(this, "splice", args);
      },
      toReversed() {
        return reactiveReadArray(this).toReversed();
      },
      toSorted(comparer) {
        return reactiveReadArray(this).toSorted(comparer);
      },
      toSpliced(...args) {
        return reactiveReadArray(this).toSpliced(...args);
      },
      unshift(...args) {
        return noTracking(this, "unshift", args);
      },
      values() {
        return iterator(this, "values", toReactive);
      }
    };
    function iterator(self2, method, wrapValue) {
      const arr = shallowReadArray(self2);
      const iter = arr[method]();
      if (arr !== self2 && !isShallow(self2)) {
        iter._next = iter.next;
        iter.next = () => {
          const result = iter._next();
          if (result.value) {
            result.value = wrapValue(result.value);
          }
          return result;
        };
      }
      return iter;
    }
    const arrayProto = Array.prototype;
    function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
      const arr = shallowReadArray(self2);
      const needsWrap = arr !== self2 && !isShallow(self2);
      const methodFn = arr[method];
      if (methodFn !== arrayProto[method]) {
        const result2 = methodFn.apply(self2, args);
        return needsWrap ? toReactive(result2) : result2;
      }
      let wrappedFn = fn;
      if (arr !== self2) {
        if (needsWrap) {
          wrappedFn = function(item, index) {
            return fn.call(this, toReactive(item), index, self2);
          };
        } else if (fn.length > 2) {
          wrappedFn = function(item, index) {
            return fn.call(this, item, index, self2);
          };
        }
      }
      const result = methodFn.call(arr, wrappedFn, thisArg);
      return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
    }
    function reduce(self2, method, fn, args) {
      const arr = shallowReadArray(self2);
      let wrappedFn = fn;
      if (arr !== self2) {
        if (!isShallow(self2)) {
          wrappedFn = function(acc, item, index) {
            return fn.call(this, acc, toReactive(item), index, self2);
          };
        } else if (fn.length > 3) {
          wrappedFn = function(acc, item, index) {
            return fn.call(this, acc, item, index, self2);
          };
        }
      }
      return arr[method](wrappedFn, ...args);
    }
    function searchProxy(self2, method, args) {
      const arr = toRaw(self2);
      track(arr, "iterate", ARRAY_ITERATE_KEY);
      const res = arr[method](...args);
      if ((res === -1 || res === false) && isProxy(args[0])) {
        args[0] = toRaw(args[0]);
        return arr[method](...args);
      }
      return res;
    }
    function noTracking(self2, method, args = []) {
      pauseTracking();
      startBatch();
      const res = toRaw(self2)[method].apply(self2, args);
      endBatch();
      resetTracking();
      return res;
    }
    const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
    const builtInSymbols = new Set(
      /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
    );
    function hasOwnProperty(key) {
      if (!isSymbol(key)) key = String(key);
      const obj = toRaw(this);
      track(obj, "has", key);
      return obj.hasOwnProperty(key);
    }
    class BaseReactiveHandler {
      constructor(_isReadonly = false, _isShallow = false) {
        this._isReadonly = _isReadonly;
        this._isShallow = _isShallow;
      }
      get(target, key, receiver) {
        if (key === "__v_skip") return target["__v_skip"];
        const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_isShallow") {
          return isShallow2;
        } else if (key === "__v_raw") {
          if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
          // this means the receiver is a user proxy of the reactive proxy
          Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
            return target;
          }
          return;
        }
        const targetIsArray = isArray(target);
        if (!isReadonly2) {
          let fn;
          if (targetIsArray && (fn = arrayInstrumentations[key])) {
            return fn;
          }
          if (key === "hasOwnProperty") {
            return hasOwnProperty;
          }
        }
        const res = Reflect.get(
          target,
          key,
          // if this is a proxy wrapping a ref, return methods using the raw ref
          // as receiver so that we don't have to call `toRaw` on the ref in all
          // its class methods
          isRef(target) ? target : receiver
        );
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (isShallow2) {
          return res;
        }
        if (isRef(res)) {
          return targetIsArray && isIntegerKey(key) ? res : res.value;
        }
        if (isObject(res)) {
          return isReadonly2 ? readonly(res) : reactive(res);
        }
        return res;
      }
    }
    class MutableReactiveHandler extends BaseReactiveHandler {
      constructor(isShallow2 = false) {
        super(false, isShallow2);
      }
      set(target, key, value, receiver) {
        let oldValue = target[key];
        if (!this._isShallow) {
          const isOldValueReadonly = isReadonly(oldValue);
          if (!isShallow(value) && !isReadonly(value)) {
            oldValue = toRaw(oldValue);
            value = toRaw(value);
          }
          if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
            if (isOldValueReadonly) {
              return false;
            } else {
              oldValue.value = value;
              return true;
            }
          }
        }
        const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const result = Reflect.set(
          target,
          key,
          value,
          isRef(target) ? target : receiver
        );
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
        }
        return result;
      }
      deleteProperty(target, key) {
        const hadKey = hasOwn(target, key);
        target[key];
        const result = Reflect.deleteProperty(target, key);
        if (result && hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      }
      has(target, key) {
        const result = Reflect.has(target, key);
        if (!isSymbol(key) || !builtInSymbols.has(key)) {
          track(target, "has", key);
        }
        return result;
      }
      ownKeys(target) {
        track(
          target,
          "iterate",
          isArray(target) ? "length" : ITERATE_KEY
        );
        return Reflect.ownKeys(target);
      }
    }
    class ReadonlyReactiveHandler extends BaseReactiveHandler {
      constructor(isShallow2 = false) {
        super(true, isShallow2);
      }
      set(target, key) {
        return true;
      }
      deleteProperty(target, key) {
        return true;
      }
    }
    const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
    const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
    const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
    const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
    const toShallow = (value) => value;
    const getProto = (v) => Reflect.getPrototypeOf(v);
    function createIterableMethod(method, isReadonly2, isShallow2) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const targetIsMap = isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(
          rawTarget,
          "iterate",
          isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
        );
        return {
          // iterator protocol
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          },
          // iterable protocol
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        return type === "delete" ? false : type === "clear" ? void 0 : this;
      };
    }
    function createInstrumentations(readonly2, shallow) {
      const instrumentations = {
        get(key) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const rawKey = toRaw(key);
          if (!readonly2) {
            if (hasChanged(key, rawKey)) {
              track(rawTarget, "get", key);
            }
            track(rawTarget, "get", rawKey);
          }
          const { has } = getProto(rawTarget);
          const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
          if (has.call(rawTarget, key)) {
            return wrap(target.get(key));
          } else if (has.call(rawTarget, rawKey)) {
            return wrap(target.get(rawKey));
          } else if (target !== rawTarget) {
            target.get(key);
          }
        },
        get size() {
          const target = this["__v_raw"];
          !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
          return Reflect.get(target, "size", target);
        },
        has(key) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const rawKey = toRaw(key);
          if (!readonly2) {
            if (hasChanged(key, rawKey)) {
              track(rawTarget, "has", key);
            }
            track(rawTarget, "has", rawKey);
          }
          return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
        },
        forEach(callback, thisArg) {
          const observed = this;
          const target = observed["__v_raw"];
          const rawTarget = toRaw(target);
          const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
          !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
          return target.forEach((value, key) => {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
          });
        }
      };
      extend(
        instrumentations,
        readonly2 ? {
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear")
        } : {
          add(value) {
            if (!shallow && !isShallow(value) && !isReadonly(value)) {
              value = toRaw(value);
            }
            const target = toRaw(this);
            const proto = getProto(target);
            const hadKey = proto.has.call(target, value);
            if (!hadKey) {
              target.add(value);
              trigger(target, "add", value, value);
            }
            return this;
          },
          set(key, value) {
            if (!shallow && !isShallow(value) && !isReadonly(value)) {
              value = toRaw(value);
            }
            const target = toRaw(this);
            const { has, get } = getProto(target);
            let hadKey = has.call(target, key);
            if (!hadKey) {
              key = toRaw(key);
              hadKey = has.call(target, key);
            }
            const oldValue = get.call(target, key);
            target.set(key, value);
            if (!hadKey) {
              trigger(target, "add", key, value);
            } else if (hasChanged(value, oldValue)) {
              trigger(target, "set", key, value);
            }
            return this;
          },
          delete(key) {
            const target = toRaw(this);
            const { has, get } = getProto(target);
            let hadKey = has.call(target, key);
            if (!hadKey) {
              key = toRaw(key);
              hadKey = has.call(target, key);
            }
            get ? get.call(target, key) : void 0;
            const result = target.delete(key);
            if (hadKey) {
              trigger(target, "delete", key, void 0);
            }
            return result;
          },
          clear() {
            const target = toRaw(this);
            const hadItems = target.size !== 0;
            const result = target.clear();
            if (hadItems) {
              trigger(
                target,
                "clear",
                void 0,
                void 0
              );
            }
            return result;
          }
        }
      );
      const iteratorMethods = [
        "keys",
        "values",
        "entries",
        Symbol.iterator
      ];
      iteratorMethods.forEach((method) => {
        instrumentations[method] = createIterableMethod(method, readonly2, shallow);
      });
      return instrumentations;
    }
    function createInstrumentationGetter(isReadonly2, shallow) {
      const instrumentations = createInstrumentations(isReadonly2, shallow);
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(
          hasOwn(instrumentations, key) && key in target ? instrumentations : target,
          key,
          receiver
        );
      };
    }
    const mutableCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, false)
    };
    const shallowCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(false, true)
    };
    const readonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, false)
    };
    const shallowReadonlyCollectionHandlers = {
      get: /* @__PURE__ */ createInstrumentationGetter(true, true)
    };
    const reactiveMap = /* @__PURE__ */ new WeakMap();
    const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    const readonlyMap = /* @__PURE__ */ new WeakMap();
    const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
    }
    function reactive(target) {
      if (isReadonly(target)) {
        return target;
      }
      return createReactiveObject(
        target,
        false,
        mutableHandlers,
        mutableCollectionHandlers,
        reactiveMap
      );
    }
    function shallowReactive(target) {
      return createReactiveObject(
        target,
        false,
        shallowReactiveHandlers,
        shallowCollectionHandlers,
        shallowReactiveMap
      );
    }
    function readonly(target) {
      return createReactiveObject(
        target,
        true,
        readonlyHandlers,
        readonlyCollectionHandlers,
        readonlyMap
      );
    }
    function shallowReadonly(target) {
      return createReactiveObject(
        target,
        true,
        shallowReadonlyHandlers,
        shallowReadonlyCollectionHandlers,
        shallowReadonlyMap
      );
    }
    function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
      if (!isObject(target)) {
        return target;
      }
      if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
        return target;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const proxy = new Proxy(
        target,
        targetType === 2 ? collectionHandlers : baseHandlers
      );
      proxyMap.set(target, proxy);
      return proxy;
    }
    function isReactive(value) {
      if (isReadonly(value)) {
        return isReactive(value["__v_raw"]);
      }
      return !!(value && value["__v_isReactive"]);
    }
    function isReadonly(value) {
      return !!(value && value["__v_isReadonly"]);
    }
    function isShallow(value) {
      return !!(value && value["__v_isShallow"]);
    }
    function isProxy(value) {
      return value ? !!value["__v_raw"] : false;
    }
    function toRaw(observed) {
      const raw = observed && observed["__v_raw"];
      return raw ? toRaw(raw) : observed;
    }
    function markRaw(value) {
      if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
        def(value, "__v_skip", true);
      }
      return value;
    }
    const toReactive = (value) => isObject(value) ? reactive(value) : value;
    const toReadonly = (value) => isObject(value) ? readonly(value) : value;
    function isRef(r) {
      return r ? r["__v_isRef"] === true : false;
    }
    function ref(value) {
      return createRef(value, false);
    }
    function createRef(rawValue, shallow) {
      if (isRef(rawValue)) {
        return rawValue;
      }
      return new RefImpl(rawValue, shallow);
    }
    class RefImpl {
      constructor(value, isShallow2) {
        this.dep = new Dep();
        this["__v_isRef"] = true;
        this["__v_isShallow"] = false;
        this._rawValue = isShallow2 ? value : toRaw(value);
        this._value = isShallow2 ? value : toReactive(value);
        this["__v_isShallow"] = isShallow2;
      }
      get value() {
        {
          this.dep.track();
        }
        return this._value;
      }
      set value(newValue) {
        const oldValue = this._rawValue;
        const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
        newValue = useDirectValue ? newValue : toRaw(newValue);
        if (hasChanged(newValue, oldValue)) {
          this._rawValue = newValue;
          this._value = useDirectValue ? newValue : toReactive(newValue);
          {
            this.dep.trigger();
          }
        }
      }
    }
    function unref(ref2) {
      return isRef(ref2) ? ref2.value : ref2;
    }
    const shallowUnwrapHandlers = {
      get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    function proxyRefs(objectWithRefs) {
      return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
    }
    class ComputedRefImpl {
      constructor(fn, setter, isSSR) {
        this.fn = fn;
        this.setter = setter;
        this._value = void 0;
        this.dep = new Dep(this);
        this.__v_isRef = true;
        this.deps = void 0;
        this.depsTail = void 0;
        this.flags = 16;
        this.globalVersion = globalVersion - 1;
        this.next = void 0;
        this.effect = this;
        this["__v_isReadonly"] = !setter;
        this.isSSR = isSSR;
      }
      /**
       * @internal
       */
      notify() {
        this.flags |= 16;
        if (!(this.flags & 8) && // avoid infinite self recursion
        activeSub !== this) {
          batch(this, true);
          return true;
        }
      }
      get value() {
        const link = this.dep.track();
        refreshComputed(this);
        if (link) {
          link.version = this.dep.version;
        }
        return this._value;
      }
      set value(newValue) {
        if (this.setter) {
          this.setter(newValue);
        }
      }
    }
    function computed$1(getterOrOptions, debugOptions, isSSR = false) {
      let getter;
      let setter;
      if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
      } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
      }
      const cRef = new ComputedRefImpl(getter, setter, isSSR);
      return cRef;
    }
    const INITIAL_WATCHER_VALUE = {};
    const cleanupMap = /* @__PURE__ */ new WeakMap();
    let activeWatcher = void 0;
    function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
      if (owner) {
        let cleanups = cleanupMap.get(owner);
        if (!cleanups) cleanupMap.set(owner, cleanups = []);
        cleanups.push(cleanupFn);
      }
    }
    function watch$1(source, cb, options = EMPTY_OBJ) {
      const { immediate, deep, once, scheduler, augmentJob, call } = options;
      const reactiveGetter = (source2) => {
        if (deep) return source2;
        if (isShallow(source2) || deep === false || deep === 0)
          return traverse(source2, 1);
        return traverse(source2);
      };
      let effect2;
      let getter;
      let cleanup;
      let boundCleanup;
      let forceTrigger = false;
      let isMultiSource = false;
      if (isRef(source)) {
        getter = () => source.value;
        forceTrigger = isShallow(source);
      } else if (isReactive(source)) {
        getter = () => reactiveGetter(source);
        forceTrigger = true;
      } else if (isArray(source)) {
        isMultiSource = true;
        forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
        getter = () => source.map((s) => {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return reactiveGetter(s);
          } else if (isFunction(s)) {
            return call ? call(s, 2) : s();
          } else ;
        });
      } else if (isFunction(source)) {
        if (cb) {
          getter = call ? () => call(source, 2) : source;
        } else {
          getter = () => {
            if (cleanup) {
              pauseTracking();
              try {
                cleanup();
              } finally {
                resetTracking();
              }
            }
            const currentEffect = activeWatcher;
            activeWatcher = effect2;
            try {
              return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
            } finally {
              activeWatcher = currentEffect;
            }
          };
        }
      } else {
        getter = NOOP;
      }
      if (cb && deep) {
        const baseGetter = getter;
        const depth = deep === true ? Infinity : deep;
        getter = () => traverse(baseGetter(), depth);
      }
      const scope = getCurrentScope();
      const watchHandle = () => {
        effect2.stop();
        if (scope && scope.active) {
          remove(scope.effects, effect2);
        }
      };
      if (once && cb) {
        const _cb = cb;
        cb = (...args) => {
          _cb(...args);
          watchHandle();
        };
      }
      let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
      const job = (immediateFirstRun) => {
        if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
          return;
        }
        if (cb) {
          const newValue = effect2.run();
          if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
            if (cleanup) {
              cleanup();
            }
            const currentWatcher = activeWatcher;
            activeWatcher = effect2;
            try {
              const args = [
                newValue,
                // pass undefined as the old value when it's changed for the first time
                oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
                boundCleanup
              ];
              oldValue = newValue;
              call ? call(cb, 3, args) : (
                // @ts-expect-error
                cb(...args)
              );
            } finally {
              activeWatcher = currentWatcher;
            }
          }
        } else {
          effect2.run();
        }
      };
      if (augmentJob) {
        augmentJob(job);
      }
      effect2 = new ReactiveEffect(getter);
      effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
      boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
      cleanup = effect2.onStop = () => {
        const cleanups = cleanupMap.get(effect2);
        if (cleanups) {
          if (call) {
            call(cleanups, 4);
          } else {
            for (const cleanup2 of cleanups) cleanup2();
          }
          cleanupMap.delete(effect2);
        }
      };
      if (cb) {
        if (immediate) {
          job(true);
        } else {
          oldValue = effect2.run();
        }
      } else if (scheduler) {
        scheduler(job.bind(null, true), true);
      } else {
        effect2.run();
      }
      watchHandle.pause = effect2.pause.bind(effect2);
      watchHandle.resume = effect2.resume.bind(effect2);
      watchHandle.stop = watchHandle;
      return watchHandle;
    }
    function traverse(value, depth = Infinity, seen) {
      if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
        return value;
      }
      seen = seen || /* @__PURE__ */ new Set();
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      depth--;
      if (isRef(value)) {
        traverse(value.value, depth, seen);
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          traverse(value[i], depth, seen);
        }
      } else if (isSet(value) || isMap(value)) {
        value.forEach((v) => {
          traverse(v, depth, seen);
        });
      } else if (isPlainObject(value)) {
        for (const key in value) {
          traverse(value[key], depth, seen);
        }
        for (const key of Object.getOwnPropertySymbols(value)) {
          if (Object.prototype.propertyIsEnumerable.call(value, key)) {
            traverse(value[key], depth, seen);
          }
        }
      }
      return value;
    }
    /**
    * @vue/runtime-core v3.5.18
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    const stack = [];
    let isWarning = false;
    function warn$1(msg, ...args) {
      if (isWarning) return;
      isWarning = true;
      pauseTracking();
      const instance = stack.length ? stack[stack.length - 1].component : null;
      const appWarnHandler = instance && instance.appContext.config.warnHandler;
      const trace = getComponentTrace();
      if (appWarnHandler) {
        callWithErrorHandling(
          appWarnHandler,
          instance,
          11,
          [
            // eslint-disable-next-line no-restricted-syntax
            msg + args.map((a) => {
              var _a, _b;
              return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
            }).join(""),
            instance && instance.proxy,
            trace.map(
              ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
            ).join("\n"),
            trace
          ]
        );
      } else {
        const warnArgs = [`[Vue warn]: ${msg}`, ...args];
        if (trace.length && // avoid spamming console during tests
        true) {
          warnArgs.push(`
`, ...formatTrace(trace));
        }
        console.warn(...warnArgs);
      }
      resetTracking();
      isWarning = false;
    }
    function getComponentTrace() {
      let currentVNode = stack[stack.length - 1];
      if (!currentVNode) {
        return [];
      }
      const normalizedStack = [];
      while (currentVNode) {
        const last = normalizedStack[0];
        if (last && last.vnode === currentVNode) {
          last.recurseCount++;
        } else {
          normalizedStack.push({
            vnode: currentVNode,
            recurseCount: 0
          });
        }
        const parentInstance = currentVNode.component && currentVNode.component.parent;
        currentVNode = parentInstance && parentInstance.vnode;
      }
      return normalizedStack;
    }
    function formatTrace(trace) {
      const logs = [];
      trace.forEach((entry, i) => {
        logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
      });
      return logs;
    }
    function formatTraceEntry({ vnode, recurseCount }) {
      const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
      const isRoot = vnode.component ? vnode.component.parent == null : false;
      const open = ` at <${formatComponentName(
        vnode.component,
        vnode.type,
        isRoot
      )}`;
      const close = `>` + postfix;
      return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
    }
    function formatProps(props) {
      const res = [];
      const keys = Object.keys(props);
      keys.slice(0, 3).forEach((key) => {
        res.push(...formatProp(key, props[key]));
      });
      if (keys.length > 3) {
        res.push(` ...`);
      }
      return res;
    }
    function formatProp(key, value, raw) {
      if (isString(value)) {
        value = JSON.stringify(value);
        return raw ? value : [`${key}=${value}`];
      } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
        return raw ? value : [`${key}=${value}`];
      } else if (isRef(value)) {
        value = formatProp(key, toRaw(value.value), true);
        return raw ? value : [`${key}=Ref<`, value, `>`];
      } else if (isFunction(value)) {
        return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
      } else {
        value = toRaw(value);
        return raw ? value : [`${key}=`, value];
      }
    }
    function callWithErrorHandling(fn, instance, type, args) {
      try {
        return args ? fn(...args) : fn();
      } catch (err) {
        handleError(err, instance, type);
      }
    }
    function callWithAsyncErrorHandling(fn, instance, type, args) {
      if (isFunction(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && isPromise(res)) {
          res.catch((err) => {
            handleError(err, instance, type);
          });
        }
        return res;
      }
      if (isArray(fn)) {
        const values = [];
        for (let i = 0; i < fn.length; i++) {
          values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
        }
        return values;
      }
    }
    function handleError(err, instance, type, throwInDev = true) {
      const contextVNode = instance ? instance.vnode : null;
      const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
      if (instance) {
        let cur = instance.parent;
        const exposedInstance = instance.proxy;
        const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
        while (cur) {
          const errorCapturedHooks = cur.ec;
          if (errorCapturedHooks) {
            for (let i = 0; i < errorCapturedHooks.length; i++) {
              if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
                return;
              }
            }
          }
          cur = cur.parent;
        }
        if (errorHandler) {
          pauseTracking();
          callWithErrorHandling(errorHandler, null, 10, [
            err,
            exposedInstance,
            errorInfo
          ]);
          resetTracking();
          return;
        }
      }
      logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
    }
    function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
      if (throwInProd) {
        throw err;
      } else {
        console.error(err);
      }
    }
    const queue = [];
    let flushIndex = -1;
    const pendingPostFlushCbs = [];
    let activePostFlushCbs = null;
    let postFlushIndex = 0;
    const resolvedPromise = /* @__PURE__ */ Promise.resolve();
    let currentFlushPromise = null;
    function nextTick(fn) {
      const p2 = currentFlushPromise || resolvedPromise;
      return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
    }
    function findInsertionIndex(id) {
      let start = flushIndex + 1;
      let end = queue.length;
      while (start < end) {
        const middle = start + end >>> 1;
        const middleJob = queue[middle];
        const middleJobId = getId(middleJob);
        if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      return start;
    }
    function queueJob(job) {
      if (!(job.flags & 1)) {
        const jobId = getId(job);
        const lastJob = queue[queue.length - 1];
        if (!lastJob || // fast path when the job id is larger than the tail
        !(job.flags & 2) && jobId >= getId(lastJob)) {
          queue.push(job);
        } else {
          queue.splice(findInsertionIndex(jobId), 0, job);
        }
        job.flags |= 1;
        queueFlush();
      }
    }
    function queueFlush() {
      if (!currentFlushPromise) {
        currentFlushPromise = resolvedPromise.then(flushJobs);
      }
    }
    function queuePostFlushCb(cb) {
      if (!isArray(cb)) {
        if (activePostFlushCbs && cb.id === -1) {
          activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
        } else if (!(cb.flags & 1)) {
          pendingPostFlushCbs.push(cb);
          cb.flags |= 1;
        }
      } else {
        pendingPostFlushCbs.push(...cb);
      }
      queueFlush();
    }
    function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
      for (; i < queue.length; i++) {
        const cb = queue[i];
        if (cb && cb.flags & 2) {
          if (instance && cb.id !== instance.uid) {
            continue;
          }
          queue.splice(i, 1);
          i--;
          if (cb.flags & 4) {
            cb.flags &= -2;
          }
          cb();
          if (!(cb.flags & 4)) {
            cb.flags &= -2;
          }
        }
      }
    }
    function flushPostFlushCbs(seen) {
      if (pendingPostFlushCbs.length) {
        const deduped = [...new Set(pendingPostFlushCbs)].sort(
          (a, b) => getId(a) - getId(b)
        );
        pendingPostFlushCbs.length = 0;
        if (activePostFlushCbs) {
          activePostFlushCbs.push(...deduped);
          return;
        }
        activePostFlushCbs = deduped;
        for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
          const cb = activePostFlushCbs[postFlushIndex];
          if (cb.flags & 4) {
            cb.flags &= -2;
          }
          if (!(cb.flags & 8)) cb();
          cb.flags &= -2;
        }
        activePostFlushCbs = null;
        postFlushIndex = 0;
      }
    }
    const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
    function flushJobs(seen) {
      try {
        for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
          const job = queue[flushIndex];
          if (job && !(job.flags & 8)) {
            if (false) ;
            if (job.flags & 4) {
              job.flags &= ~1;
            }
            callWithErrorHandling(
              job,
              job.i,
              job.i ? 15 : 14
            );
            if (!(job.flags & 4)) {
              job.flags &= ~1;
            }
          }
        }
      } finally {
        for (; flushIndex < queue.length; flushIndex++) {
          const job = queue[flushIndex];
          if (job) {
            job.flags &= -2;
          }
        }
        flushIndex = -1;
        queue.length = 0;
        flushPostFlushCbs();
        currentFlushPromise = null;
        if (queue.length || pendingPostFlushCbs.length) {
          flushJobs();
        }
      }
    }
    let currentRenderingInstance = null;
    let currentScopeId = null;
    function setCurrentRenderingInstance(instance) {
      const prev = currentRenderingInstance;
      currentRenderingInstance = instance;
      currentScopeId = instance && instance.type.__scopeId || null;
      return prev;
    }
    function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
      if (!ctx) return fn;
      if (fn._n) {
        return fn;
      }
      const renderFnWithContext = (...args) => {
        if (renderFnWithContext._d) {
          setBlockTracking(-1);
        }
        const prevInstance = setCurrentRenderingInstance(ctx);
        let res;
        try {
          res = fn(...args);
        } finally {
          setCurrentRenderingInstance(prevInstance);
          if (renderFnWithContext._d) {
            setBlockTracking(1);
          }
        }
        return res;
      };
      renderFnWithContext._n = true;
      renderFnWithContext._c = true;
      renderFnWithContext._d = true;
      return renderFnWithContext;
    }
    function withDirectives(vnode, directives) {
      if (currentRenderingInstance === null) {
        return vnode;
      }
      const instance = getComponentPublicInstance(currentRenderingInstance);
      const bindings = vnode.dirs || (vnode.dirs = []);
      for (let i = 0; i < directives.length; i++) {
        let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
        if (dir) {
          if (isFunction(dir)) {
            dir = {
              mounted: dir,
              updated: dir
            };
          }
          if (dir.deep) {
            traverse(value);
          }
          bindings.push({
            dir,
            instance,
            value,
            oldValue: void 0,
            arg,
            modifiers
          });
        }
      }
      return vnode;
    }
    function invokeDirectiveHook(vnode, prevVNode, instance, name) {
      const bindings = vnode.dirs;
      const oldBindings = prevVNode && prevVNode.dirs;
      for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i];
        if (oldBindings) {
          binding.oldValue = oldBindings[i].value;
        }
        let hook = binding.dir[name];
        if (hook) {
          pauseTracking();
          callWithAsyncErrorHandling(hook, instance, 8, [
            vnode.el,
            binding,
            vnode,
            prevVNode
          ]);
          resetTracking();
        }
      }
    }
    const TeleportEndKey = Symbol("_vte");
    const isTeleport = (type) => type.__isTeleport;
    const leaveCbKey = Symbol("_leaveCb");
    const enterCbKey = Symbol("_enterCb");
    function useTransitionState() {
      const state = {
        isMounted: false,
        isLeaving: false,
        isUnmounting: false,
        leavingVNodes: /* @__PURE__ */ new Map()
      };
      onMounted(() => {
        state.isMounted = true;
      });
      onBeforeUnmount(() => {
        state.isUnmounting = true;
      });
      return state;
    }
    const TransitionHookValidator = [Function, Array];
    const BaseTransitionPropsValidators = {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      // enter
      onBeforeEnter: TransitionHookValidator,
      onEnter: TransitionHookValidator,
      onAfterEnter: TransitionHookValidator,
      onEnterCancelled: TransitionHookValidator,
      // leave
      onBeforeLeave: TransitionHookValidator,
      onLeave: TransitionHookValidator,
      onAfterLeave: TransitionHookValidator,
      onLeaveCancelled: TransitionHookValidator,
      // appear
      onBeforeAppear: TransitionHookValidator,
      onAppear: TransitionHookValidator,
      onAfterAppear: TransitionHookValidator,
      onAppearCancelled: TransitionHookValidator
    };
    const recursiveGetSubtree = (instance) => {
      const subTree = instance.subTree;
      return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
    };
    const BaseTransitionImpl = {
      name: `BaseTransition`,
      props: BaseTransitionPropsValidators,
      setup(props, { slots }) {
        const instance = getCurrentInstance();
        const state = useTransitionState();
        return () => {
          const children = slots.default && getTransitionRawChildren(slots.default(), true);
          if (!children || !children.length) {
            return;
          }
          const child = findNonCommentChild(children);
          const rawProps = toRaw(props);
          const { mode } = rawProps;
          if (state.isLeaving) {
            return emptyPlaceholder(child);
          }
          const innerChild = getInnerChild$1(child);
          if (!innerChild) {
            return emptyPlaceholder(child);
          }
          let enterHooks = resolveTransitionHooks(
            innerChild,
            rawProps,
            state,
            instance,
            // #11061, ensure enterHooks is fresh after clone
            (hooks) => enterHooks = hooks
          );
          if (innerChild.type !== Comment) {
            setTransitionHooks(innerChild, enterHooks);
          }
          let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
          if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(innerChild, oldInnerChild) && recursiveGetSubtree(instance).type !== Comment) {
            let leavingHooks = resolveTransitionHooks(
              oldInnerChild,
              rawProps,
              state,
              instance
            );
            setTransitionHooks(oldInnerChild, leavingHooks);
            if (mode === "out-in" && innerChild.type !== Comment) {
              state.isLeaving = true;
              leavingHooks.afterLeave = () => {
                state.isLeaving = false;
                if (!(instance.job.flags & 8)) {
                  instance.update();
                }
                delete leavingHooks.afterLeave;
                oldInnerChild = void 0;
              };
              return emptyPlaceholder(child);
            } else if (mode === "in-out" && innerChild.type !== Comment) {
              leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
                const leavingVNodesCache = getLeavingNodesForType(
                  state,
                  oldInnerChild
                );
                leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
                el[leaveCbKey] = () => {
                  earlyRemove();
                  el[leaveCbKey] = void 0;
                  delete enterHooks.delayedLeave;
                  oldInnerChild = void 0;
                };
                enterHooks.delayedLeave = () => {
                  delayedLeave();
                  delete enterHooks.delayedLeave;
                  oldInnerChild = void 0;
                };
              };
            } else {
              oldInnerChild = void 0;
            }
          } else if (oldInnerChild) {
            oldInnerChild = void 0;
          }
          return child;
        };
      }
    };
    function findNonCommentChild(children) {
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      return child;
    }
    const BaseTransition = BaseTransitionImpl;
    function getLeavingNodesForType(state, vnode) {
      const { leavingVNodes } = state;
      let leavingVNodesCache = leavingVNodes.get(vnode.type);
      if (!leavingVNodesCache) {
        leavingVNodesCache = /* @__PURE__ */ Object.create(null);
        leavingVNodes.set(vnode.type, leavingVNodesCache);
      }
      return leavingVNodesCache;
    }
    function resolveTransitionHooks(vnode, props, state, instance, postClone) {
      const {
        appear,
        mode,
        persisted = false,
        onBeforeEnter,
        onEnter,
        onAfterEnter,
        onEnterCancelled,
        onBeforeLeave,
        onLeave,
        onAfterLeave,
        onLeaveCancelled,
        onBeforeAppear,
        onAppear,
        onAfterAppear,
        onAppearCancelled
      } = props;
      const key = String(vnode.key);
      const leavingVNodesCache = getLeavingNodesForType(state, vnode);
      const callHook2 = (hook, args) => {
        hook && callWithAsyncErrorHandling(
          hook,
          instance,
          9,
          args
        );
      };
      const callAsyncHook = (hook, args) => {
        const done = args[1];
        callHook2(hook, args);
        if (isArray(hook)) {
          if (hook.every((hook2) => hook2.length <= 1)) done();
        } else if (hook.length <= 1) {
          done();
        }
      };
      const hooks = {
        mode,
        persisted,
        beforeEnter(el) {
          let hook = onBeforeEnter;
          if (!state.isMounted) {
            if (appear) {
              hook = onBeforeAppear || onBeforeEnter;
            } else {
              return;
            }
          }
          if (el[leaveCbKey]) {
            el[leaveCbKey](
              true
              /* cancelled */
            );
          }
          const leavingVNode = leavingVNodesCache[key];
          if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
            leavingVNode.el[leaveCbKey]();
          }
          callHook2(hook, [el]);
        },
        enter(el) {
          let hook = onEnter;
          let afterHook = onAfterEnter;
          let cancelHook = onEnterCancelled;
          if (!state.isMounted) {
            if (appear) {
              hook = onAppear || onEnter;
              afterHook = onAfterAppear || onAfterEnter;
              cancelHook = onAppearCancelled || onEnterCancelled;
            } else {
              return;
            }
          }
          let called = false;
          const done = el[enterCbKey] = (cancelled) => {
            if (called) return;
            called = true;
            if (cancelled) {
              callHook2(cancelHook, [el]);
            } else {
              callHook2(afterHook, [el]);
            }
            if (hooks.delayedLeave) {
              hooks.delayedLeave();
            }
            el[enterCbKey] = void 0;
          };
          if (hook) {
            callAsyncHook(hook, [el, done]);
          } else {
            done();
          }
        },
        leave(el, remove2) {
          const key2 = String(vnode.key);
          if (el[enterCbKey]) {
            el[enterCbKey](
              true
              /* cancelled */
            );
          }
          if (state.isUnmounting) {
            return remove2();
          }
          callHook2(onBeforeLeave, [el]);
          let called = false;
          const done = el[leaveCbKey] = (cancelled) => {
            if (called) return;
            called = true;
            remove2();
            if (cancelled) {
              callHook2(onLeaveCancelled, [el]);
            } else {
              callHook2(onAfterLeave, [el]);
            }
            el[leaveCbKey] = void 0;
            if (leavingVNodesCache[key2] === vnode) {
              delete leavingVNodesCache[key2];
            }
          };
          leavingVNodesCache[key2] = vnode;
          if (onLeave) {
            callAsyncHook(onLeave, [el, done]);
          } else {
            done();
          }
        },
        clone(vnode2) {
          const hooks2 = resolveTransitionHooks(
            vnode2,
            props,
            state,
            instance,
            postClone
          );
          if (postClone) postClone(hooks2);
          return hooks2;
        }
      };
      return hooks;
    }
    function emptyPlaceholder(vnode) {
      if (isKeepAlive(vnode)) {
        vnode = cloneVNode(vnode);
        vnode.children = null;
        return vnode;
      }
    }
    function getInnerChild$1(vnode) {
      if (!isKeepAlive(vnode)) {
        if (isTeleport(vnode.type) && vnode.children) {
          return findNonCommentChild(vnode.children);
        }
        return vnode;
      }
      if (vnode.component) {
        return vnode.component.subTree;
      }
      const { shapeFlag, children } = vnode;
      if (children) {
        if (shapeFlag & 16) {
          return children[0];
        }
        if (shapeFlag & 32 && isFunction(children.default)) {
          return children.default();
        }
      }
    }
    function setTransitionHooks(vnode, hooks) {
      if (vnode.shapeFlag & 6 && vnode.component) {
        vnode.transition = hooks;
        setTransitionHooks(vnode.component.subTree, hooks);
      } else if (vnode.shapeFlag & 128) {
        vnode.ssContent.transition = hooks.clone(vnode.ssContent);
        vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
      } else {
        vnode.transition = hooks;
      }
    }
    function getTransitionRawChildren(children, keepComment = false, parentKey) {
      let ret = [];
      let keyedFragmentCount = 0;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
        if (child.type === Fragment) {
          if (child.patchFlag & 128) keyedFragmentCount++;
          ret = ret.concat(
            getTransitionRawChildren(child.children, keepComment, key)
          );
        } else if (keepComment || child.type !== Comment) {
          ret.push(key != null ? cloneVNode(child, { key }) : child);
        }
      }
      if (keyedFragmentCount > 1) {
        for (let i = 0; i < ret.length; i++) {
          ret[i].patchFlag = -2;
        }
      }
      return ret;
    }
    /*! #__NO_SIDE_EFFECTS__ */
    // @__NO_SIDE_EFFECTS__
    function defineComponent(options, extraOptions) {
      return isFunction(options) ? (
        // #8236: extend call and options.name access are considered side-effects
        // by Rollup, so we have to wrap it in a pure-annotated IIFE.
        /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
      ) : options;
    }
    function markAsyncBoundary(instance) {
      instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
    }
    function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
      if (isArray(rawRef)) {
        rawRef.forEach(
          (r, i) => setRef(
            r,
            oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
            parentSuspense,
            vnode,
            isUnmount
          )
        );
        return;
      }
      if (isAsyncWrapper(vnode) && !isUnmount) {
        if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
          setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
        }
        return;
      }
      const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
      const value = isUnmount ? null : refValue;
      const { i: owner, r: ref3 } = rawRef;
      const oldRef = oldRawRef && oldRawRef.r;
      const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
      const setupState = owner.setupState;
      const rawSetupState = toRaw(setupState);
      const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
        return hasOwn(rawSetupState, key);
      };
      if (oldRef != null && oldRef !== ref3) {
        if (isString(oldRef)) {
          refs[oldRef] = null;
          if (canSetSetupRef(oldRef)) {
            setupState[oldRef] = null;
          }
        } else if (isRef(oldRef)) {
          oldRef.value = null;
        }
      }
      if (isFunction(ref3)) {
        callWithErrorHandling(ref3, owner, 12, [value, refs]);
      } else {
        const _isString = isString(ref3);
        const _isRef = isRef(ref3);
        if (_isString || _isRef) {
          const doSet = () => {
            if (rawRef.f) {
              const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
              if (isUnmount) {
                isArray(existing) && remove(existing, refValue);
              } else {
                if (!isArray(existing)) {
                  if (_isString) {
                    refs[ref3] = [refValue];
                    if (canSetSetupRef(ref3)) {
                      setupState[ref3] = refs[ref3];
                    }
                  } else {
                    ref3.value = [refValue];
                    if (rawRef.k) refs[rawRef.k] = ref3.value;
                  }
                } else if (!existing.includes(refValue)) {
                  existing.push(refValue);
                }
              }
            } else if (_isString) {
              refs[ref3] = value;
              if (canSetSetupRef(ref3)) {
                setupState[ref3] = value;
              }
            } else if (_isRef) {
              ref3.value = value;
              if (rawRef.k) refs[rawRef.k] = value;
            } else ;
          };
          if (value) {
            doSet.id = -1;
            queuePostRenderEffect(doSet, parentSuspense);
          } else {
            doSet();
          }
        }
      }
    }
    const isComment = (node) => node.nodeType === 8;
    getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
    getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
    function forEachElement(node, cb) {
      if (isComment(node) && node.data === "[") {
        let depth = 1;
        let next = node.nextSibling;
        while (next) {
          if (next.nodeType === 1) {
            const result = cb(next);
            if (result === false) {
              break;
            }
          } else if (isComment(next)) {
            if (next.data === "]") {
              if (--depth === 0) break;
            } else if (next.data === "[") {
              depth++;
            }
          }
          next = next.nextSibling;
        }
      } else {
        cb(node);
      }
    }
    const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
    /*! #__NO_SIDE_EFFECTS__ */
    // @__NO_SIDE_EFFECTS__
    function defineAsyncComponent(source) {
      if (isFunction(source)) {
        source = { loader: source };
      }
      const {
        loader,
        loadingComponent,
        errorComponent,
        delay = 200,
        hydrate: hydrateStrategy,
        timeout,
        // undefined = never times out
        suspensible = true,
        onError: userOnError
      } = source;
      let pendingRequest = null;
      let resolvedComp;
      let retries = 0;
      const retry = () => {
        retries++;
        pendingRequest = null;
        return load();
      };
      const load = () => {
        let thisRequest;
        return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
          err = err instanceof Error ? err : new Error(String(err));
          if (userOnError) {
            return new Promise((resolve2, reject) => {
              const userRetry = () => resolve2(retry());
              const userFail = () => reject(err);
              userOnError(err, userRetry, userFail, retries + 1);
            });
          } else {
            throw err;
          }
        }).then((comp) => {
          if (thisRequest !== pendingRequest && pendingRequest) {
            return pendingRequest;
          }
          if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
            comp = comp.default;
          }
          resolvedComp = comp;
          return comp;
        }));
      };
      return /* @__PURE__ */ defineComponent({
        name: "AsyncComponentWrapper",
        __asyncLoader: load,
        __asyncHydrate(el, instance, hydrate) {
          let patched = false;
          (instance.bu || (instance.bu = [])).push(() => patched = true);
          const performHydrate = () => {
            if (patched) {
              return;
            }
            hydrate();
          };
          const doHydrate = hydrateStrategy ? () => {
            const teardown = hydrateStrategy(
              performHydrate,
              (cb) => forEachElement(el, cb)
            );
            if (teardown) {
              (instance.bum || (instance.bum = [])).push(teardown);
            }
          } : performHydrate;
          if (resolvedComp) {
            doHydrate();
          } else {
            load().then(() => !instance.isUnmounted && doHydrate());
          }
        },
        get __asyncResolved() {
          return resolvedComp;
        },
        setup() {
          const instance = currentInstance;
          markAsyncBoundary(instance);
          if (resolvedComp) {
            return () => createInnerComp(resolvedComp, instance);
          }
          const onError = (err) => {
            pendingRequest = null;
            handleError(
              err,
              instance,
              13,
              !errorComponent
            );
          };
          if (suspensible && instance.suspense || isInSSRComponentSetup) {
            return load().then((comp) => {
              return () => createInnerComp(comp, instance);
            }).catch((err) => {
              onError(err);
              return () => errorComponent ? createVNode(errorComponent, {
                error: err
              }) : null;
            });
          }
          const loaded = ref(false);
          const error2 = ref();
          const delayed = ref(!!delay);
          if (delay) {
            setTimeout(() => {
              delayed.value = false;
            }, delay);
          }
          if (timeout != null) {
            setTimeout(() => {
              if (!loaded.value && !error2.value) {
                const err = new Error(
                  `Async component timed out after ${timeout}ms.`
                );
                onError(err);
                error2.value = err;
              }
            }, timeout);
          }
          load().then(() => {
            loaded.value = true;
            if (instance.parent && isKeepAlive(instance.parent.vnode)) {
              instance.parent.update();
            }
          }).catch((err) => {
            onError(err);
            error2.value = err;
          });
          return () => {
            if (loaded.value && resolvedComp) {
              return createInnerComp(resolvedComp, instance);
            } else if (error2.value && errorComponent) {
              return createVNode(errorComponent, {
                error: error2.value
              });
            } else if (loadingComponent && !delayed.value) {
              return createVNode(loadingComponent);
            }
          };
        }
      });
    }
    function createInnerComp(comp, parent) {
      const { ref: ref22, props, children, ce } = parent.vnode;
      const vnode = createVNode(comp, props, children);
      vnode.ref = ref22;
      vnode.ce = ce;
      delete parent.vnode.ce;
      return vnode;
    }
    const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
    function onActivated(hook, target) {
      registerKeepAliveHook(hook, "a", target);
    }
    function onDeactivated(hook, target) {
      registerKeepAliveHook(hook, "da", target);
    }
    function registerKeepAliveHook(hook, type, target = currentInstance) {
      const wrappedHook = hook.__wdc || (hook.__wdc = () => {
        let current = target;
        while (current) {
          if (current.isDeactivated) {
            return;
          }
          current = current.parent;
        }
        return hook();
      });
      injectHook(type, wrappedHook, target);
      if (target) {
        let current = target.parent;
        while (current && current.parent) {
          if (isKeepAlive(current.parent.vnode)) {
            injectToKeepAliveRoot(wrappedHook, type, target, current);
          }
          current = current.parent;
        }
      }
    }
    function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
      const injected = injectHook(
        type,
        hook,
        keepAliveRoot,
        true
        /* prepend */
      );
      onUnmounted(() => {
        remove(keepAliveRoot[type], injected);
      }, target);
    }
    function injectHook(type, hook, target = currentInstance, prepend = false) {
      if (target) {
        const hooks = target[type] || (target[type] = []);
        const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
          pauseTracking();
          const reset = setCurrentInstance(target);
          const res = callWithAsyncErrorHandling(hook, target, type, args);
          reset();
          resetTracking();
          return res;
        });
        if (prepend) {
          hooks.unshift(wrappedHook);
        } else {
          hooks.push(wrappedHook);
        }
        return wrappedHook;
      }
    }
    const createHook = (lifecycle) => (hook, target = currentInstance) => {
      if (!isInSSRComponentSetup || lifecycle === "sp") {
        injectHook(lifecycle, (...args) => hook(...args), target);
      }
    };
    const onBeforeMount = createHook("bm");
    const onMounted = createHook("m");
    const onBeforeUpdate = createHook(
      "bu"
    );
    const onUpdated = createHook("u");
    const onBeforeUnmount = createHook(
      "bum"
    );
    const onUnmounted = createHook("um");
    const onServerPrefetch = createHook(
      "sp"
    );
    const onRenderTriggered = createHook("rtg");
    const onRenderTracked = createHook("rtc");
    function onErrorCaptured(hook, target = currentInstance) {
      injectHook("ec", hook, target);
    }
    const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
    function renderList(source, renderItem, cache, index) {
      let ret;
      const cached = cache;
      const sourceIsArray = isArray(source);
      if (sourceIsArray || isString(source)) {
        const sourceIsReactiveArray = sourceIsArray && isReactive(source);
        let needsWrap = false;
        let isReadonlySource = false;
        if (sourceIsReactiveArray) {
          needsWrap = !isShallow(source);
          isReadonlySource = isReadonly(source);
          source = shallowReadArray(source);
        }
        ret = new Array(source.length);
        for (let i = 0, l = source.length; i < l; i++) {
          ret[i] = renderItem(
            needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
            i,
            void 0,
            cached
          );
        }
      } else if (typeof source === "number") {
        ret = new Array(source);
        for (let i = 0; i < source; i++) {
          ret[i] = renderItem(i + 1, i, void 0, cached);
        }
      } else if (isObject(source)) {
        if (source[Symbol.iterator]) {
          ret = Array.from(
            source,
            (item, i) => renderItem(item, i, void 0, cached)
          );
        } else {
          const keys = Object.keys(source);
          ret = new Array(keys.length);
          for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            ret[i] = renderItem(source[key], key, i, cached);
          }
        }
      } else {
        ret = [];
      }
      return ret;
    }
    const getPublicInstance = (i) => {
      if (!i) return null;
      if (isStatefulComponent(i)) return getComponentPublicInstance(i);
      return getPublicInstance(i.parent);
    };
    const publicPropertiesMap = (
      // Move PURE marker to new line to workaround compiler discarding it
      // due to type annotation
      /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
        $: (i) => i,
        $el: (i) => i.vnode.el,
        $data: (i) => i.data,
        $props: (i) => i.props,
        $attrs: (i) => i.attrs,
        $slots: (i) => i.slots,
        $refs: (i) => i.refs,
        $parent: (i) => getPublicInstance(i.parent),
        $root: (i) => getPublicInstance(i.root),
        $host: (i) => i.ce,
        $emit: (i) => i.emit,
        $options: (i) => resolveMergedOptions(i),
        $forceUpdate: (i) => i.f || (i.f = () => {
          queueJob(i.update);
        }),
        $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
        $watch: (i) => instanceWatch.bind(i)
      })
    );
    const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
    const PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
        if (key === "__v_skip") {
          return true;
        }
        const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
        let normalizedProps;
        if (key[0] !== "$") {
          const n = accessCache[key];
          if (n !== void 0) {
            switch (n) {
              case 1:
                return setupState[key];
              case 2:
                return data[key];
              case 4:
                return ctx[key];
              case 3:
                return props[key];
            }
          } else if (hasSetupBinding(setupState, key)) {
            accessCache[key] = 1;
            return setupState[key];
          } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
            accessCache[key] = 2;
            return data[key];
          } else if (
            // only cache other properties when instance has declared (thus stable)
            // props
            (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
          ) {
            accessCache[key] = 3;
            return props[key];
          } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
            accessCache[key] = 4;
            return ctx[key];
          } else if (shouldCacheAccess) {
            accessCache[key] = 0;
          }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        if (publicGetter) {
          if (key === "$attrs") {
            track(instance.attrs, "get", "");
          }
          return publicGetter(instance);
        } else if (
          // css module (injected by vue-loader)
          (cssModule = type.__cssModules) && (cssModule = cssModule[key])
        ) {
          return cssModule;
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (
          // global properties
          globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
        ) {
          {
            return globalProperties[key];
          }
        } else ;
      },
      set({ _: instance }, key, value) {
        const { data, setupState, ctx } = instance;
        if (hasSetupBinding(setupState, key)) {
          setupState[key] = value;
          return true;
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          data[key] = value;
          return true;
        } else if (hasOwn(instance.props, key)) {
          return false;
        }
        if (key[0] === "$" && key.slice(1) in instance) {
          return false;
        } else {
          {
            ctx[key] = value;
          }
        }
        return true;
      },
      has({
        _: { data, setupState, accessCache, ctx, appContext, propsOptions }
      }, key) {
        let normalizedProps;
        return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
      },
      defineProperty(target, key, descriptor) {
        if (descriptor.get != null) {
          target._.accessCache[key] = 0;
        } else if (hasOwn(descriptor, "value")) {
          this.set(target, key, descriptor.value, null);
        }
        return Reflect.defineProperty(target, key, descriptor);
      }
    };
    function normalizePropsOrEmits(props) {
      return isArray(props) ? props.reduce(
        (normalized, p2) => (normalized[p2] = null, normalized),
        {}
      ) : props;
    }
    let shouldCacheAccess = true;
    function applyOptions(instance) {
      const options = resolveMergedOptions(instance);
      const publicThis = instance.proxy;
      const ctx = instance.ctx;
      shouldCacheAccess = false;
      if (options.beforeCreate) {
        callHook$1(options.beforeCreate, instance, "bc");
      }
      const {
        // state
        data: dataOptions,
        computed: computedOptions,
        methods,
        watch: watchOptions,
        provide: provideOptions,
        inject: injectOptions,
        // lifecycle
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeDestroy,
        beforeUnmount,
        destroyed,
        unmounted,
        render,
        renderTracked,
        renderTriggered,
        errorCaptured,
        serverPrefetch,
        // public API
        expose,
        inheritAttrs,
        // assets
        components,
        directives,
        filters
      } = options;
      const checkDuplicateProperties = null;
      if (injectOptions) {
        resolveInjections(injectOptions, ctx, checkDuplicateProperties);
      }
      if (methods) {
        for (const key in methods) {
          const methodHandler = methods[key];
          if (isFunction(methodHandler)) {
            {
              ctx[key] = methodHandler.bind(publicThis);
            }
          }
        }
      }
      if (dataOptions) {
        const data = dataOptions.call(publicThis, publicThis);
        if (!isObject(data)) ;
        else {
          instance.data = reactive(data);
        }
      }
      shouldCacheAccess = true;
      if (computedOptions) {
        for (const key in computedOptions) {
          const opt = computedOptions[key];
          const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
          const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
          const c = computed({
            get,
            set
          });
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => c.value,
            set: (v) => c.value = v
          });
        }
      }
      if (watchOptions) {
        for (const key in watchOptions) {
          createWatcher(watchOptions[key], ctx, publicThis, key);
        }
      }
      if (provideOptions) {
        const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
        Reflect.ownKeys(provides).forEach((key) => {
          provide(key, provides[key]);
        });
      }
      if (created) {
        callHook$1(created, instance, "c");
      }
      function registerLifecycleHook(register, hook) {
        if (isArray(hook)) {
          hook.forEach((_hook) => register(_hook.bind(publicThis)));
        } else if (hook) {
          register(hook.bind(publicThis));
        }
      }
      registerLifecycleHook(onBeforeMount, beforeMount);
      registerLifecycleHook(onMounted, mounted);
      registerLifecycleHook(onBeforeUpdate, beforeUpdate);
      registerLifecycleHook(onUpdated, updated);
      registerLifecycleHook(onActivated, activated);
      registerLifecycleHook(onDeactivated, deactivated);
      registerLifecycleHook(onErrorCaptured, errorCaptured);
      registerLifecycleHook(onRenderTracked, renderTracked);
      registerLifecycleHook(onRenderTriggered, renderTriggered);
      registerLifecycleHook(onBeforeUnmount, beforeUnmount);
      registerLifecycleHook(onUnmounted, unmounted);
      registerLifecycleHook(onServerPrefetch, serverPrefetch);
      if (isArray(expose)) {
        if (expose.length) {
          const exposed = instance.exposed || (instance.exposed = {});
          expose.forEach((key) => {
            Object.defineProperty(exposed, key, {
              get: () => publicThis[key],
              set: (val) => publicThis[key] = val,
              enumerable: true
            });
          });
        } else if (!instance.exposed) {
          instance.exposed = {};
        }
      }
      if (render && instance.render === NOOP) {
        instance.render = render;
      }
      if (inheritAttrs != null) {
        instance.inheritAttrs = inheritAttrs;
      }
      if (components) instance.components = components;
      if (directives) instance.directives = directives;
      if (serverPrefetch) {
        markAsyncBoundary(instance);
      }
    }
    function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
      if (isArray(injectOptions)) {
        injectOptions = normalizeInject(injectOptions);
      }
      for (const key in injectOptions) {
        const opt = injectOptions[key];
        let injected;
        if (isObject(opt)) {
          if ("default" in opt) {
            injected = inject(
              opt.from || key,
              opt.default,
              true
            );
          } else {
            injected = inject(opt.from || key);
          }
        } else {
          injected = inject(opt);
        }
        if (isRef(injected)) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => injected.value,
            set: (v) => injected.value = v
          });
        } else {
          ctx[key] = injected;
        }
      }
    }
    function callHook$1(hook, instance, type) {
      callWithAsyncErrorHandling(
        isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
        instance,
        type
      );
    }
    function createWatcher(raw, ctx, publicThis, key) {
      let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
      if (isString(raw)) {
        const handler = ctx[raw];
        if (isFunction(handler)) {
          {
            watch(getter, handler);
          }
        }
      } else if (isFunction(raw)) {
        {
          watch(getter, raw.bind(publicThis));
        }
      } else if (isObject(raw)) {
        if (isArray(raw)) {
          raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
        } else {
          const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
          if (isFunction(handler)) {
            watch(getter, handler, raw);
          }
        }
      } else ;
    }
    function resolveMergedOptions(instance) {
      const base = instance.type;
      const { mixins, extends: extendsOptions } = base;
      const {
        mixins: globalMixins,
        optionsCache: cache,
        config: { optionMergeStrategies }
      } = instance.appContext;
      const cached = cache.get(base);
      let resolved;
      if (cached) {
        resolved = cached;
      } else if (!globalMixins.length && !mixins && !extendsOptions) {
        {
          resolved = base;
        }
      } else {
        resolved = {};
        if (globalMixins.length) {
          globalMixins.forEach(
            (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
          );
        }
        mergeOptions(resolved, base, optionMergeStrategies);
      }
      if (isObject(base)) {
        cache.set(base, resolved);
      }
      return resolved;
    }
    function mergeOptions(to, from, strats, asMixin = false) {
      const { mixins, extends: extendsOptions } = from;
      if (extendsOptions) {
        mergeOptions(to, extendsOptions, strats, true);
      }
      if (mixins) {
        mixins.forEach(
          (m) => mergeOptions(to, m, strats, true)
        );
      }
      for (const key in from) {
        if (asMixin && key === "expose") ;
        else {
          const strat = internalOptionMergeStrats[key] || strats && strats[key];
          to[key] = strat ? strat(to[key], from[key]) : from[key];
        }
      }
      return to;
    }
    const internalOptionMergeStrats = {
      data: mergeDataFn,
      props: mergeEmitsOrPropsOptions,
      emits: mergeEmitsOrPropsOptions,
      // objects
      methods: mergeObjectOptions,
      computed: mergeObjectOptions,
      // lifecycle
      beforeCreate: mergeAsArray,
      created: mergeAsArray,
      beforeMount: mergeAsArray,
      mounted: mergeAsArray,
      beforeUpdate: mergeAsArray,
      updated: mergeAsArray,
      beforeDestroy: mergeAsArray,
      beforeUnmount: mergeAsArray,
      destroyed: mergeAsArray,
      unmounted: mergeAsArray,
      activated: mergeAsArray,
      deactivated: mergeAsArray,
      errorCaptured: mergeAsArray,
      serverPrefetch: mergeAsArray,
      // assets
      components: mergeObjectOptions,
      directives: mergeObjectOptions,
      // watch
      watch: mergeWatchOptions,
      // provide / inject
      provide: mergeDataFn,
      inject: mergeInject
    };
    function mergeDataFn(to, from) {
      if (!from) {
        return to;
      }
      if (!to) {
        return from;
      }
      return function mergedDataFn() {
        return extend(
          isFunction(to) ? to.call(this, this) : to,
          isFunction(from) ? from.call(this, this) : from
        );
      };
    }
    function mergeInject(to, from) {
      return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
    }
    function normalizeInject(raw) {
      if (isArray(raw)) {
        const res = {};
        for (let i = 0; i < raw.length; i++) {
          res[raw[i]] = raw[i];
        }
        return res;
      }
      return raw;
    }
    function mergeAsArray(to, from) {
      return to ? [...new Set([].concat(to, from))] : from;
    }
    function mergeObjectOptions(to, from) {
      return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
    }
    function mergeEmitsOrPropsOptions(to, from) {
      if (to) {
        if (isArray(to) && isArray(from)) {
          return [.../* @__PURE__ */ new Set([...to, ...from])];
        }
        return extend(
          /* @__PURE__ */ Object.create(null),
          normalizePropsOrEmits(to),
          normalizePropsOrEmits(from != null ? from : {})
        );
      } else {
        return from;
      }
    }
    function mergeWatchOptions(to, from) {
      if (!to) return from;
      if (!from) return to;
      const merged = extend(/* @__PURE__ */ Object.create(null), to);
      for (const key in from) {
        merged[key] = mergeAsArray(to[key], from[key]);
      }
      return merged;
    }
    function createAppContext() {
      return {
        app: null,
        config: {
          isNativeTag: NO,
          performance: false,
          globalProperties: {},
          optionMergeStrategies: {},
          errorHandler: void 0,
          warnHandler: void 0,
          compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: /* @__PURE__ */ Object.create(null),
        optionsCache: /* @__PURE__ */ new WeakMap(),
        propsCache: /* @__PURE__ */ new WeakMap(),
        emitsCache: /* @__PURE__ */ new WeakMap()
      };
    }
    let uid$1 = 0;
    function createAppAPI(render, hydrate) {
      return function createApp2(rootComponent, rootProps = null) {
        if (!isFunction(rootComponent)) {
          rootComponent = extend({}, rootComponent);
        }
        if (rootProps != null && !isObject(rootProps)) {
          rootProps = null;
        }
        const context = createAppContext();
        const installedPlugins = /* @__PURE__ */ new WeakSet();
        const pluginCleanupFns = [];
        let isMounted = false;
        const app = context.app = {
          _uid: uid$1++,
          _component: rootComponent,
          _props: rootProps,
          _container: null,
          _context: context,
          _instance: null,
          version,
          get config() {
            return context.config;
          },
          set config(v) {
          },
          use(plugin, ...options) {
            if (installedPlugins.has(plugin)) ;
            else if (plugin && isFunction(plugin.install)) {
              installedPlugins.add(plugin);
              plugin.install(app, ...options);
            } else if (isFunction(plugin)) {
              installedPlugins.add(plugin);
              plugin(app, ...options);
            } else ;
            return app;
          },
          mixin(mixin) {
            {
              if (!context.mixins.includes(mixin)) {
                context.mixins.push(mixin);
              }
            }
            return app;
          },
          component(name, component) {
            if (!component) {
              return context.components[name];
            }
            context.components[name] = component;
            return app;
          },
          directive(name, directive) {
            if (!directive) {
              return context.directives[name];
            }
            context.directives[name] = directive;
            return app;
          },
          mount(rootContainer, isHydrate, namespace) {
            if (!isMounted) {
              const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
              vnode.appContext = context;
              if (namespace === true) {
                namespace = "svg";
              } else if (namespace === false) {
                namespace = void 0;
              }
              {
                render(vnode, rootContainer, namespace);
              }
              isMounted = true;
              app._container = rootContainer;
              rootContainer.__vue_app__ = app;
              return getComponentPublicInstance(vnode.component);
            }
          },
          onUnmount(cleanupFn) {
            pluginCleanupFns.push(cleanupFn);
          },
          unmount() {
            if (isMounted) {
              callWithAsyncErrorHandling(
                pluginCleanupFns,
                app._instance,
                16
              );
              render(null, app._container);
              delete app._container.__vue_app__;
            }
          },
          provide(key, value) {
            context.provides[key] = value;
            return app;
          },
          runWithContext(fn) {
            const lastApp = currentApp;
            currentApp = app;
            try {
              return fn();
            } finally {
              currentApp = lastApp;
            }
          }
        };
        return app;
      };
    }
    let currentApp = null;
    function provide(key, value) {
      if (!currentInstance) ;
      else {
        let provides = currentInstance.provides;
        const parentProvides = currentInstance.parent && currentInstance.parent.provides;
        if (parentProvides === provides) {
          provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
      }
    }
    function inject(key, defaultValue, treatDefaultAsFactory = false) {
      const instance = getCurrentInstance();
      if (instance || currentApp) {
        let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
        if (provides && key in provides) {
          return provides[key];
        } else if (arguments.length > 1) {
          return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
        } else ;
      }
    }
    const internalObjectProto = {};
    const createInternalObject = () => Object.create(internalObjectProto);
    const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
    function initProps(instance, rawProps, isStateful, isSSR = false) {
      const props = {};
      const attrs = createInternalObject();
      instance.propsDefaults = /* @__PURE__ */ Object.create(null);
      setFullProps(instance, rawProps, props, attrs);
      for (const key in instance.propsOptions[0]) {
        if (!(key in props)) {
          props[key] = void 0;
        }
      }
      if (isStateful) {
        instance.props = isSSR ? props : shallowReactive(props);
      } else {
        if (!instance.type.props) {
          instance.props = attrs;
        } else {
          instance.props = props;
        }
      }
      instance.attrs = attrs;
    }
    function updateProps(instance, rawProps, rawPrevProps, optimized) {
      const {
        props,
        attrs,
        vnode: { patchFlag }
      } = instance;
      const rawCurrentProps = toRaw(props);
      const [options] = instance.propsOptions;
      let hasAttrsChanged = false;
      if (
        // always force full diff in dev
        // - #1942 if hmr is enabled with sfc component
        // - vite#872 non-sfc component used by sfc component
        (optimized || patchFlag > 0) && !(patchFlag & 16)
      ) {
        if (patchFlag & 8) {
          const propsToUpdate = instance.vnode.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            let key = propsToUpdate[i];
            if (isEmitListener(instance.emitsOptions, key)) {
              continue;
            }
            const value = rawProps[key];
            if (options) {
              if (hasOwn(attrs, key)) {
                if (value !== attrs[key]) {
                  attrs[key] = value;
                  hasAttrsChanged = true;
                }
              } else {
                const camelizedKey = camelize(key);
                props[camelizedKey] = resolvePropValue(
                  options,
                  rawCurrentProps,
                  camelizedKey,
                  value,
                  instance,
                  false
                );
              }
            } else {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            }
          }
        }
      } else {
        if (setFullProps(instance, rawProps, props, attrs)) {
          hasAttrsChanged = true;
        }
        let kebabKey;
        for (const key in rawCurrentProps) {
          if (!rawProps || // for camelCase
          !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
          // and converted to camelCase (#955)
          ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
            if (options) {
              if (rawPrevProps && // for camelCase
              (rawPrevProps[key] !== void 0 || // for kebab-case
              rawPrevProps[kebabKey] !== void 0)) {
                props[key] = resolvePropValue(
                  options,
                  rawCurrentProps,
                  key,
                  void 0,
                  instance,
                  true
                );
              }
            } else {
              delete props[key];
            }
          }
        }
        if (attrs !== rawCurrentProps) {
          for (const key in attrs) {
            if (!rawProps || !hasOwn(rawProps, key) && true) {
              delete attrs[key];
              hasAttrsChanged = true;
            }
          }
        }
      }
      if (hasAttrsChanged) {
        trigger(instance.attrs, "set", "");
      }
    }
    function setFullProps(instance, rawProps, props, attrs) {
      const [options, needCastKeys] = instance.propsOptions;
      let hasAttrsChanged = false;
      let rawCastValues;
      if (rawProps) {
        for (let key in rawProps) {
          if (isReservedProp(key)) {
            continue;
          }
          const value = rawProps[key];
          let camelKey;
          if (options && hasOwn(options, camelKey = camelize(key))) {
            if (!needCastKeys || !needCastKeys.includes(camelKey)) {
              props[camelKey] = value;
            } else {
              (rawCastValues || (rawCastValues = {}))[camelKey] = value;
            }
          } else if (!isEmitListener(instance.emitsOptions, key)) {
            if (!(key in attrs) || value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
      if (needCastKeys) {
        const rawCurrentProps = toRaw(props);
        const castValues = rawCastValues || EMPTY_OBJ;
        for (let i = 0; i < needCastKeys.length; i++) {
          const key = needCastKeys[i];
          props[key] = resolvePropValue(
            options,
            rawCurrentProps,
            key,
            castValues[key],
            instance,
            !hasOwn(castValues, key)
          );
        }
      }
      return hasAttrsChanged;
    }
    function resolvePropValue(options, props, key, value, instance, isAbsent) {
      const opt = options[key];
      if (opt != null) {
        const hasDefault = hasOwn(opt, "default");
        if (hasDefault && value === void 0) {
          const defaultValue = opt.default;
          if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
            const { propsDefaults } = instance;
            if (key in propsDefaults) {
              value = propsDefaults[key];
            } else {
              const reset = setCurrentInstance(instance);
              value = propsDefaults[key] = defaultValue.call(
                null,
                props
              );
              reset();
            }
          } else {
            value = defaultValue;
          }
          if (instance.ce) {
            instance.ce._setProp(key, value);
          }
        }
        if (opt[
          0
          /* shouldCast */
        ]) {
          if (isAbsent && !hasDefault) {
            value = false;
          } else if (opt[
            1
            /* shouldCastTrue */
          ] && (value === "" || value === hyphenate(key))) {
            value = true;
          }
        }
      }
      return value;
    }
    const mixinPropsCache = /* @__PURE__ */ new WeakMap();
    function normalizePropsOptions(comp, appContext, asMixin = false) {
      const cache = asMixin ? mixinPropsCache : appContext.propsCache;
      const cached = cache.get(comp);
      if (cached) {
        return cached;
      }
      const raw = comp.props;
      const normalized = {};
      const needCastKeys = [];
      let hasExtends = false;
      if (!isFunction(comp)) {
        const extendProps = (raw2) => {
          hasExtends = true;
          const [props, keys] = normalizePropsOptions(raw2, appContext, true);
          extend(normalized, props);
          if (keys) needCastKeys.push(...keys);
        };
        if (!asMixin && appContext.mixins.length) {
          appContext.mixins.forEach(extendProps);
        }
        if (comp.extends) {
          extendProps(comp.extends);
        }
        if (comp.mixins) {
          comp.mixins.forEach(extendProps);
        }
      }
      if (!raw && !hasExtends) {
        if (isObject(comp)) {
          cache.set(comp, EMPTY_ARR);
        }
        return EMPTY_ARR;
      }
      if (isArray(raw)) {
        for (let i = 0; i < raw.length; i++) {
          const normalizedKey = camelize(raw[i]);
          if (validatePropName(normalizedKey)) {
            normalized[normalizedKey] = EMPTY_OBJ;
          }
        }
      } else if (raw) {
        for (const key in raw) {
          const normalizedKey = camelize(key);
          if (validatePropName(normalizedKey)) {
            const opt = raw[key];
            const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
            const propType = prop.type;
            let shouldCast = false;
            let shouldCastTrue = true;
            if (isArray(propType)) {
              for (let index = 0; index < propType.length; ++index) {
                const type = propType[index];
                const typeName = isFunction(type) && type.name;
                if (typeName === "Boolean") {
                  shouldCast = true;
                  break;
                } else if (typeName === "String") {
                  shouldCastTrue = false;
                }
              }
            } else {
              shouldCast = isFunction(propType) && propType.name === "Boolean";
            }
            prop[
              0
              /* shouldCast */
            ] = shouldCast;
            prop[
              1
              /* shouldCastTrue */
            ] = shouldCastTrue;
            if (shouldCast || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
      const res = [normalized, needCastKeys];
      if (isObject(comp)) {
        cache.set(comp, res);
      }
      return res;
    }
    function validatePropName(key) {
      if (key[0] !== "$" && !isReservedProp(key)) {
        return true;
      }
      return false;
    }
    const isInternalKey = (key) => key === "_" || key === "__" || key === "_ctx" || key === "$stable";
    const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
    const normalizeSlot = (key, rawSlot, ctx) => {
      if (rawSlot._n) {
        return rawSlot;
      }
      const normalized = withCtx((...args) => {
        if (false) ;
        return normalizeSlotValue(rawSlot(...args));
      }, ctx);
      normalized._c = false;
      return normalized;
    };
    const normalizeObjectSlots = (rawSlots, slots, instance) => {
      const ctx = rawSlots._ctx;
      for (const key in rawSlots) {
        if (isInternalKey(key)) continue;
        const value = rawSlots[key];
        if (isFunction(value)) {
          slots[key] = normalizeSlot(key, value, ctx);
        } else if (value != null) {
          const normalized = normalizeSlotValue(value);
          slots[key] = () => normalized;
        }
      }
    };
    const normalizeVNodeSlots = (instance, children) => {
      const normalized = normalizeSlotValue(children);
      instance.slots.default = () => normalized;
    };
    const assignSlots = (slots, children, optimized) => {
      for (const key in children) {
        if (optimized || !isInternalKey(key)) {
          slots[key] = children[key];
        }
      }
    };
    const initSlots = (instance, children, optimized) => {
      const slots = instance.slots = createInternalObject();
      if (instance.vnode.shapeFlag & 32) {
        const cacheIndexes = children.__;
        if (cacheIndexes) def(slots, "__", cacheIndexes, true);
        const type = children._;
        if (type) {
          assignSlots(slots, children, optimized);
          if (optimized) {
            def(slots, "_", type, true);
          }
        } else {
          normalizeObjectSlots(children, slots);
        }
      } else if (children) {
        normalizeVNodeSlots(instance, children);
      }
    };
    const updateSlots = (instance, children, optimized) => {
      const { vnode, slots } = instance;
      let needDeletionCheck = true;
      let deletionComparisonTarget = EMPTY_OBJ;
      if (vnode.shapeFlag & 32) {
        const type = children._;
        if (type) {
          if (optimized && type === 1) {
            needDeletionCheck = false;
          } else {
            assignSlots(slots, children, optimized);
          }
        } else {
          needDeletionCheck = !children.$stable;
          normalizeObjectSlots(children, slots);
        }
        deletionComparisonTarget = children;
      } else if (children) {
        normalizeVNodeSlots(instance, children);
        deletionComparisonTarget = { default: 1 };
      }
      if (needDeletionCheck) {
        for (const key in slots) {
          if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
            delete slots[key];
          }
        }
      }
    };
    const queuePostRenderEffect = queueEffectWithSuspense;
    function createRenderer(options) {
      return baseCreateRenderer(options);
    }
    function baseCreateRenderer(options, createHydrationFns) {
      const target = getGlobalThis();
      target.__VUE__ = true;
      const {
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        createComment: hostCreateComment,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        setScopeId: hostSetScopeId = NOOP,
        insertStaticContent: hostInsertStaticContent
      } = options;
      const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
        if (n1 === n2) {
          return;
        }
        if (n1 && !isSameVNodeType(n1, n2)) {
          anchor = getNextHostNode(n1);
          unmount(n1, parentComponent, parentSuspense, true);
          n1 = null;
        }
        if (n2.patchFlag === -2) {
          optimized = false;
          n2.dynamicChildren = null;
        }
        const { type, ref: ref3, shapeFlag } = n2;
        switch (type) {
          case Text:
            processText(n1, n2, container, anchor);
            break;
          case Comment:
            processCommentNode(n1, n2, container, anchor);
            break;
          case Static:
            if (n1 == null) {
              mountStaticNode(n2, container, anchor, namespace);
            }
            break;
          case Fragment:
            processFragment(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            break;
          default:
            if (shapeFlag & 1) {
              processElement(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else if (shapeFlag & 6) {
              processComponent(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else if (shapeFlag & 64) {
              type.process(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized,
                internals
              );
            } else if (shapeFlag & 128) {
              type.process(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized,
                internals
              );
            } else ;
        }
        if (ref3 != null && parentComponent) {
          setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
        } else if (ref3 == null && n1 && n1.ref != null) {
          setRef(n1.ref, null, parentSuspense, n1, true);
        }
      };
      const processText = (n1, n2, container, anchor) => {
        if (n1 == null) {
          hostInsert(
            n2.el = hostCreateText(n2.children),
            container,
            anchor
          );
        } else {
          const el = n2.el = n1.el;
          if (n2.children !== n1.children) {
            hostSetText(el, n2.children);
          }
        }
      };
      const processCommentNode = (n1, n2, container, anchor) => {
        if (n1 == null) {
          hostInsert(
            n2.el = hostCreateComment(n2.children || ""),
            container,
            anchor
          );
        } else {
          n2.el = n1.el;
        }
      };
      const mountStaticNode = (n2, container, anchor, namespace) => {
        [n2.el, n2.anchor] = hostInsertStaticContent(
          n2.children,
          container,
          anchor,
          namespace,
          n2.el,
          n2.anchor
        );
      };
      const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
        let next;
        while (el && el !== anchor) {
          next = hostNextSibling(el);
          hostInsert(el, container, nextSibling);
          el = next;
        }
        hostInsert(anchor, container, nextSibling);
      };
      const removeStaticNode = ({ el, anchor }) => {
        let next;
        while (el && el !== anchor) {
          next = hostNextSibling(el);
          hostRemove(el);
          el = next;
        }
        hostRemove(anchor);
      };
      const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        if (n2.type === "svg") {
          namespace = "svg";
        } else if (n2.type === "math") {
          namespace = "mathml";
        }
        if (n1 == null) {
          mountElement(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          patchElement(
            n1,
            n2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        let el;
        let vnodeHook;
        const { props, shapeFlag, transition, dirs } = vnode;
        el = vnode.el = hostCreateElement(
          vnode.type,
          namespace,
          props && props.is,
          props
        );
        if (shapeFlag & 8) {
          hostSetElementText(el, vnode.children);
        } else if (shapeFlag & 16) {
          mountChildren(
            vnode.children,
            el,
            null,
            parentComponent,
            parentSuspense,
            resolveChildrenNamespace(vnode, namespace),
            slotScopeIds,
            optimized
          );
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
        if (props) {
          for (const key in props) {
            if (key !== "value" && !isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], namespace, parentComponent);
            }
          }
          if ("value" in props) {
            hostPatchProp(el, "value", null, props.value, namespace);
          }
          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        const needCallTransitionHooks = needTransition(parentSuspense, transition);
        if (needCallTransitionHooks) {
          transition.beforeEnter(el);
        }
        hostInsert(el, container, anchor);
        if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
            needCallTransitionHooks && transition.enter(el);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
      };
      const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
        if (scopeId) {
          hostSetScopeId(el, scopeId);
        }
        if (slotScopeIds) {
          for (let i = 0; i < slotScopeIds.length; i++) {
            hostSetScopeId(el, slotScopeIds[i]);
          }
        }
        if (parentComponent) {
          let subTree = parentComponent.subTree;
          if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
            const parentVNode = parentComponent.vnode;
            setScopeId(
              el,
              parentVNode,
              parentVNode.scopeId,
              parentVNode.slotScopeIds,
              parentComponent.parent
            );
          }
        }
      };
      const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
        for (let i = start; i < children.length; i++) {
          const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
          patch(
            null,
            child,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      };
      const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        const el = n2.el = n1.el;
        let { patchFlag, dynamicChildren, dirs } = n2;
        patchFlag |= n1.patchFlag & 16;
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        let vnodeHook;
        parentComponent && toggleRecurse(parentComponent, false);
        if (vnodeHook = newProps.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        }
        if (dirs) {
          invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
        }
        parentComponent && toggleRecurse(parentComponent, true);
        if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
          hostSetElementText(el, "");
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            el,
            parentComponent,
            parentSuspense,
            resolveChildrenNamespace(n2, namespace),
            slotScopeIds
          );
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            el,
            null,
            parentComponent,
            parentSuspense,
            resolveChildrenNamespace(n2, namespace),
            slotScopeIds,
            false
          );
        }
        if (patchFlag > 0) {
          if (patchFlag & 16) {
            patchProps(el, oldProps, newProps, parentComponent, namespace);
          } else {
            if (patchFlag & 2) {
              if (oldProps.class !== newProps.class) {
                hostPatchProp(el, "class", null, newProps.class, namespace);
              }
            }
            if (patchFlag & 4) {
              hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
            }
            if (patchFlag & 8) {
              const propsToUpdate = n2.dynamicProps;
              for (let i = 0; i < propsToUpdate.length; i++) {
                const key = propsToUpdate[i];
                const prev = oldProps[key];
                const next = newProps[key];
                if (next !== prev || key === "value") {
                  hostPatchProp(el, key, prev, next, namespace, parentComponent);
                }
              }
            }
          }
          if (patchFlag & 1) {
            if (n1.children !== n2.children) {
              hostSetElementText(el, n2.children);
            }
          }
        } else if (!optimized && dynamicChildren == null) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        }
        if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
            dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
          }, parentSuspense);
        }
      };
      const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
        for (let i = 0; i < newChildren.length; i++) {
          const oldVNode = oldChildren[i];
          const newVNode = newChildren[i];
          const container = (
            // oldVNode may be an errored async setup() component inside Suspense
            // which will not have a mounted element
            oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
            // of the Fragment itself so it can move its children.
            (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
            // which also requires the correct parent container
            !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
            oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
              // In other cases, the parent container is not actually used so we
              // just pass the block element here to avoid a DOM parentNode call.
              fallbackContainer
            )
          );
          patch(
            oldVNode,
            newVNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            true
          );
        }
      };
      const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
        if (oldProps !== newProps) {
          if (oldProps !== EMPTY_OBJ) {
            for (const key in oldProps) {
              if (!isReservedProp(key) && !(key in newProps)) {
                hostPatchProp(
                  el,
                  key,
                  oldProps[key],
                  null,
                  namespace,
                  parentComponent
                );
              }
            }
          }
          for (const key in newProps) {
            if (isReservedProp(key)) continue;
            const next = newProps[key];
            const prev = oldProps[key];
            if (next !== prev && key !== "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
          if ("value" in newProps) {
            hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
          }
        }
      };
      const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
        const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
        let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
        if (fragmentSlotScopeIds) {
          slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
        }
        if (n1 == null) {
          hostInsert(fragmentStartAnchor, container, anchor);
          hostInsert(fragmentEndAnchor, container, anchor);
          mountChildren(
            // #10007
            // such fragment like `<></>` will be compiled into
            // a fragment which doesn't have a children.
            // In this case fallback to an empty array
            n2.children || [],
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
          // of renderSlot() with no valid children
          n1.dynamicChildren) {
            patchBlockChildren(
              n1.dynamicChildren,
              dynamicChildren,
              container,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds
            );
            if (
              // #2080 if the stable fragment has a key, it's a <template v-for> that may
              //  get moved around. Make sure all root level vnodes inherit el.
              // #2134 or if it's a component root, it may also get moved around
              // as the component is being moved.
              n2.key != null || parentComponent && n2 === parentComponent.subTree
            ) {
              traverseStaticChildren(
                n1,
                n2,
                true
                /* shallow */
              );
            }
          } else {
            patchChildren(
              n1,
              n2,
              container,
              fragmentEndAnchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      };
      const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        n2.slotScopeIds = slotScopeIds;
        if (n1 == null) {
          if (n2.shapeFlag & 512) {
            parentComponent.ctx.activate(
              n2,
              container,
              anchor,
              namespace,
              optimized
            );
          } else {
            mountComponent(
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              optimized
            );
          }
        } else {
          updateComponent(n1, n2, optimized);
        }
      };
      const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
        const instance = initialVNode.component = createComponentInstance(
          initialVNode,
          parentComponent,
          parentSuspense
        );
        if (isKeepAlive(initialVNode)) {
          instance.ctx.renderer = internals;
        }
        {
          setupComponent(instance, false, optimized);
        }
        if (instance.asyncDep) {
          parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
          if (!initialVNode.el) {
            const placeholder = instance.subTree = createVNode(Comment);
            processCommentNode(null, placeholder, container, anchor);
            initialVNode.placeholder = placeholder.el;
          }
        } else {
          setupRenderEffect(
            instance,
            initialVNode,
            container,
            anchor,
            parentSuspense,
            namespace,
            optimized
          );
        }
      };
      const updateComponent = (n1, n2, optimized) => {
        const instance = n2.component = n1.component;
        if (shouldUpdateComponent(n1, n2, optimized)) {
          if (instance.asyncDep && !instance.asyncResolved) {
            updateComponentPreRender(instance, n2, optimized);
            return;
          } else {
            instance.next = n2;
            instance.update();
          }
        } else {
          n2.el = n1.el;
          instance.vnode = n2;
        }
      };
      const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
        const componentUpdateFn = () => {
          if (!instance.isMounted) {
            let vnodeHook;
            const { el, props } = initialVNode;
            const { bm, m, parent, root, type } = instance;
            const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
            toggleRecurse(instance, false);
            if (bm) {
              invokeArrayFns(bm);
            }
            if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
              invokeVNodeHook(vnodeHook, parent, initialVNode);
            }
            toggleRecurse(instance, true);
            {
              if (root.ce && // @ts-expect-error _def is private
              root.ce._def.shadowRoot !== false) {
                root.ce._injectChildStyle(type);
              }
              const subTree = instance.subTree = renderComponentRoot(instance);
              patch(
                null,
                subTree,
                container,
                anchor,
                instance,
                parentSuspense,
                namespace
              );
              initialVNode.el = subTree.el;
            }
            if (m) {
              queuePostRenderEffect(m, parentSuspense);
            }
            if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
              const scopedInitialVNode = initialVNode;
              queuePostRenderEffect(
                () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
                parentSuspense
              );
            }
            if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
              instance.a && queuePostRenderEffect(instance.a, parentSuspense);
            }
            instance.isMounted = true;
            initialVNode = container = anchor = null;
          } else {
            let { next, bu, u, parent, vnode } = instance;
            {
              const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
              if (nonHydratedAsyncRoot) {
                if (next) {
                  next.el = vnode.el;
                  updateComponentPreRender(instance, next, optimized);
                }
                nonHydratedAsyncRoot.asyncDep.then(() => {
                  if (!instance.isUnmounted) {
                    componentUpdateFn();
                  }
                });
                return;
              }
            }
            let originNext = next;
            let vnodeHook;
            toggleRecurse(instance, false);
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            } else {
              next = vnode;
            }
            if (bu) {
              invokeArrayFns(bu);
            }
            if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
              invokeVNodeHook(vnodeHook, parent, next, vnode);
            }
            toggleRecurse(instance, true);
            const nextTree = renderComponentRoot(instance);
            const prevTree = instance.subTree;
            instance.subTree = nextTree;
            patch(
              prevTree,
              nextTree,
              // parent may have changed if it's in a teleport
              hostParentNode(prevTree.el),
              // anchor may have changed if it's in a fragment
              getNextHostNode(prevTree),
              instance,
              parentSuspense,
              namespace
            );
            next.el = nextTree.el;
            if (originNext === null) {
              updateHOCHostEl(instance, nextTree.el);
            }
            if (u) {
              queuePostRenderEffect(u, parentSuspense);
            }
            if (vnodeHook = next.props && next.props.onVnodeUpdated) {
              queuePostRenderEffect(
                () => invokeVNodeHook(vnodeHook, parent, next, vnode),
                parentSuspense
              );
            }
          }
        };
        instance.scope.on();
        const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
        instance.scope.off();
        const update = instance.update = effect2.run.bind(effect2);
        const job = instance.job = effect2.runIfDirty.bind(effect2);
        job.i = instance;
        job.id = instance.uid;
        effect2.scheduler = () => queueJob(job);
        toggleRecurse(instance, true);
        update();
      };
      const updateComponentPreRender = (instance, nextVNode, optimized) => {
        nextVNode.component = instance;
        const prevProps = instance.vnode.props;
        instance.vnode = nextVNode;
        instance.next = null;
        updateProps(instance, nextVNode.props, prevProps, optimized);
        updateSlots(instance, nextVNode.children, optimized);
        pauseTracking();
        flushPreFlushCbs(instance);
        resetTracking();
      };
      const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
        const c1 = n1 && n1.children;
        const prevShapeFlag = n1 ? n1.shapeFlag : 0;
        const c2 = n2.children;
        const { patchFlag, shapeFlag } = n2;
        if (patchFlag > 0) {
          if (patchFlag & 128) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            return;
          } else if (patchFlag & 256) {
            patchUnkeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            return;
          }
        }
        if (shapeFlag & 8) {
          if (prevShapeFlag & 16) {
            unmountChildren(c1, parentComponent, parentSuspense);
          }
          if (c2 !== c1) {
            hostSetElementText(container, c2);
          }
        } else {
          if (prevShapeFlag & 16) {
            if (shapeFlag & 16) {
              patchKeyedChildren(
                c1,
                c2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else {
              unmountChildren(c1, parentComponent, parentSuspense, true);
            }
          } else {
            if (prevShapeFlag & 8) {
              hostSetElementText(container, "");
            }
            if (shapeFlag & 16) {
              mountChildren(
                c2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            }
          }
        }
      };
      const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        c1 = c1 || EMPTY_ARR;
        c2 = c2 || EMPTY_ARR;
        const oldLength = c1.length;
        const newLength = c2.length;
        const commonLength = Math.min(oldLength, newLength);
        let i;
        for (i = 0; i < commonLength; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          patch(
            c1[i],
            nextChild,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
        if (oldLength > newLength) {
          unmountChildren(
            c1,
            parentComponent,
            parentSuspense,
            true,
            false,
            commonLength
          );
        } else {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            commonLength
          );
        }
      };
      const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;
        while (i <= e1 && i <= e2) {
          const n1 = c1[i];
          const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (isSameVNodeType(n1, n2)) {
            patch(
              n1,
              n2,
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            break;
          }
          i++;
        }
        while (i <= e1 && i <= e2) {
          const n1 = c1[e1];
          const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
          if (isSameVNodeType(n1, n2)) {
            patch(
              n1,
              n2,
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            break;
          }
          e1--;
          e2--;
        }
        if (i > e1) {
          if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
            while (i <= e2) {
              patch(
                null,
                c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
              i++;
            }
          }
        } else if (i > e2) {
          while (i <= e1) {
            unmount(c1[i], parentComponent, parentSuspense, true);
            i++;
          }
        } else {
          const s1 = i;
          const s2 = i;
          const keyToNewIndexMap = /* @__PURE__ */ new Map();
          for (i = s2; i <= e2; i++) {
            const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
            if (nextChild.key != null) {
              keyToNewIndexMap.set(nextChild.key, i);
            }
          }
          let j;
          let patched = 0;
          const toBePatched = e2 - s2 + 1;
          let moved = false;
          let maxNewIndexSoFar = 0;
          const newIndexToOldIndexMap = new Array(toBePatched);
          for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
          for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];
            if (patched >= toBePatched) {
              unmount(prevChild, parentComponent, parentSuspense, true);
              continue;
            }
            let newIndex;
            if (prevChild.key != null) {
              newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
              for (j = s2; j <= e2; j++) {
                if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                  newIndex = j;
                  break;
                }
              }
            }
            if (newIndex === void 0) {
              unmount(prevChild, parentComponent, parentSuspense, true);
            } else {
              newIndexToOldIndexMap[newIndex - s2] = i + 1;
              if (newIndex >= maxNewIndexSoFar) {
                maxNewIndexSoFar = newIndex;
              } else {
                moved = true;
              }
              patch(
                prevChild,
                c2[newIndex],
                container,
                null,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
              patched++;
            }
          }
          const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
          j = increasingNewIndexSequence.length - 1;
          for (i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            const anchorVNode = c2[nextIndex + 1];
            const anchor = nextIndex + 1 < l2 ? (
              // #13559, fallback to el placeholder for unresolved async component
              anchorVNode.el || anchorVNode.placeholder
            ) : parentAnchor;
            if (newIndexToOldIndexMap[i] === 0) {
              patch(
                null,
                nextChild,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace,
                slotScopeIds,
                optimized
              );
            } else if (moved) {
              if (j < 0 || i !== increasingNewIndexSequence[j]) {
                move(nextChild, container, anchor, 2);
              } else {
                j--;
              }
            }
          }
        }
      };
      const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
        const { el, type, transition, children, shapeFlag } = vnode;
        if (shapeFlag & 6) {
          move(vnode.component.subTree, container, anchor, moveType);
          return;
        }
        if (shapeFlag & 128) {
          vnode.suspense.move(container, anchor, moveType);
          return;
        }
        if (shapeFlag & 64) {
          type.move(vnode, container, anchor, internals);
          return;
        }
        if (type === Fragment) {
          hostInsert(el, container, anchor);
          for (let i = 0; i < children.length; i++) {
            move(children[i], container, anchor, moveType);
          }
          hostInsert(vnode.anchor, container, anchor);
          return;
        }
        if (type === Static) {
          moveStaticNode(vnode, container, anchor);
          return;
        }
        const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
        if (needTransition2) {
          if (moveType === 0) {
            transition.beforeEnter(el);
            hostInsert(el, container, anchor);
            queuePostRenderEffect(() => transition.enter(el), parentSuspense);
          } else {
            const { leave, delayLeave, afterLeave } = transition;
            const remove22 = () => {
              if (vnode.ctx.isUnmounted) {
                hostRemove(el);
              } else {
                hostInsert(el, container, anchor);
              }
            };
            const performLeave = () => {
              leave(el, () => {
                remove22();
                afterLeave && afterLeave();
              });
            };
            if (delayLeave) {
              delayLeave(el, remove22, performLeave);
            } else {
              performLeave();
            }
          }
        } else {
          hostInsert(el, container, anchor);
        }
      };
      const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
        const {
          type,
          props,
          ref: ref3,
          children,
          dynamicChildren,
          shapeFlag,
          patchFlag,
          dirs,
          cacheIndex
        } = vnode;
        if (patchFlag === -2) {
          optimized = false;
        }
        if (ref3 != null) {
          pauseTracking();
          setRef(ref3, null, parentSuspense, vnode, true);
          resetTracking();
        }
        if (cacheIndex != null) {
          parentComponent.renderCache[cacheIndex] = void 0;
        }
        if (shapeFlag & 256) {
          parentComponent.ctx.deactivate(vnode);
          return;
        }
        const shouldInvokeDirs = shapeFlag & 1 && dirs;
        const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
        let vnodeHook;
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
        if (shapeFlag & 6) {
          unmountComponent(vnode.component, parentSuspense, doRemove);
        } else {
          if (shapeFlag & 128) {
            vnode.suspense.unmount(parentSuspense, doRemove);
            return;
          }
          if (shouldInvokeDirs) {
            invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
          }
          if (shapeFlag & 64) {
            vnode.type.remove(
              vnode,
              parentComponent,
              parentSuspense,
              internals,
              doRemove
            );
          } else if (dynamicChildren && // #5154
          // when v-once is used inside a block, setBlockTracking(-1) marks the
          // parent block with hasOnce: true
          // so that it doesn't take the fast path during unmount - otherwise
          // components nested in v-once are never unmounted.
          !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
          (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
            unmountChildren(
              dynamicChildren,
              parentComponent,
              parentSuspense,
              false,
              true
            );
          } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
            unmountChildren(children, parentComponent, parentSuspense);
          }
          if (doRemove) {
            remove2(vnode);
          }
        }
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
          queuePostRenderEffect(() => {
            vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
            shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
          }, parentSuspense);
        }
      };
      const remove2 = (vnode) => {
        const { type, el, anchor, transition } = vnode;
        if (type === Fragment) {
          {
            removeFragment(el, anchor);
          }
          return;
        }
        if (type === Static) {
          removeStaticNode(vnode);
          return;
        }
        const performRemove = () => {
          hostRemove(el);
          if (transition && !transition.persisted && transition.afterLeave) {
            transition.afterLeave();
          }
        };
        if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
          const { leave, delayLeave } = transition;
          const performLeave = () => leave(el, performRemove);
          if (delayLeave) {
            delayLeave(vnode.el, performRemove, performLeave);
          } else {
            performLeave();
          }
        } else {
          performRemove();
        }
      };
      const removeFragment = (cur, end) => {
        let next;
        while (cur !== end) {
          next = hostNextSibling(cur);
          hostRemove(cur);
          cur = next;
        }
        hostRemove(end);
      };
      const unmountComponent = (instance, parentSuspense, doRemove) => {
        const {
          bum,
          scope,
          job,
          subTree,
          um,
          m,
          a,
          parent,
          slots: { __: slotCacheKeys }
        } = instance;
        invalidateMount(m);
        invalidateMount(a);
        if (bum) {
          invokeArrayFns(bum);
        }
        if (parent && isArray(slotCacheKeys)) {
          slotCacheKeys.forEach((v) => {
            parent.renderCache[v] = void 0;
          });
        }
        scope.stop();
        if (job) {
          job.flags |= 8;
          unmount(subTree, instance, parentSuspense, doRemove);
        }
        if (um) {
          queuePostRenderEffect(um, parentSuspense);
        }
        queuePostRenderEffect(() => {
          instance.isUnmounted = true;
        }, parentSuspense);
        if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
          parentSuspense.deps--;
          if (parentSuspense.deps === 0) {
            parentSuspense.resolve();
          }
        }
      };
      const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
        for (let i = start; i < children.length; i++) {
          unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
        }
      };
      const getNextHostNode = (vnode) => {
        if (vnode.shapeFlag & 6) {
          return getNextHostNode(vnode.component.subTree);
        }
        if (vnode.shapeFlag & 128) {
          return vnode.suspense.next();
        }
        const el = hostNextSibling(vnode.anchor || vnode.el);
        const teleportEnd = el && el[TeleportEndKey];
        return teleportEnd ? hostNextSibling(teleportEnd) : el;
      };
      let isFlushing = false;
      const render = (vnode, container, namespace) => {
        if (vnode == null) {
          if (container._vnode) {
            unmount(container._vnode, null, null, true);
          }
        } else {
          patch(
            container._vnode || null,
            vnode,
            container,
            null,
            null,
            null,
            namespace
          );
        }
        container._vnode = vnode;
        if (!isFlushing) {
          isFlushing = true;
          flushPreFlushCbs();
          flushPostFlushCbs();
          isFlushing = false;
        }
      };
      const internals = {
        p: patch,
        um: unmount,
        m: move,
        r: remove2,
        mt: mountComponent,
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        n: getNextHostNode,
        o: options
      };
      let hydrate;
      return {
        render,
        hydrate,
        createApp: createAppAPI(render)
      };
    }
    function resolveChildrenNamespace({ type, props }, currentNamespace) {
      return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
    }
    function toggleRecurse({ effect: effect2, job }, allowed) {
      if (allowed) {
        effect2.flags |= 32;
        job.flags |= 4;
      } else {
        effect2.flags &= -33;
        job.flags &= -5;
      }
    }
    function needTransition(parentSuspense, transition) {
      return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    }
    function traverseStaticChildren(n1, n2, shallow = false) {
      const ch1 = n1.children;
      const ch2 = n2.children;
      if (isArray(ch1) && isArray(ch2)) {
        for (let i = 0; i < ch1.length; i++) {
          const c1 = ch1[i];
          let c2 = ch2[i];
          if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
            if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
              c2 = ch2[i] = cloneIfMounted(ch2[i]);
              c2.el = c1.el;
            }
            if (!shallow && c2.patchFlag !== -2)
              traverseStaticChildren(c1, c2);
          }
          if (c2.type === Text) {
            c2.el = c1.el;
          }
          if (c2.type === Comment && !c2.el) {
            c2.el = c1.el;
          }
        }
      }
    }
    function getSequence(arr) {
      const p2 = arr.slice();
      const result = [0];
      let i, j, u, v, c;
      const len = arr.length;
      for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
          j = result[result.length - 1];
          if (arr[j] < arrI) {
            p2[i] = j;
            result.push(i);
            continue;
          }
          u = 0;
          v = result.length - 1;
          while (u < v) {
            c = u + v >> 1;
            if (arr[result[c]] < arrI) {
              u = c + 1;
            } else {
              v = c;
            }
          }
          if (arrI < arr[result[u]]) {
            if (u > 0) {
              p2[i] = result[u - 1];
            }
            result[u] = i;
          }
        }
      }
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
        result[u] = v;
        v = p2[v];
      }
      return result;
    }
    function locateNonHydratedAsyncRoot(instance) {
      const subComponent = instance.subTree.component;
      if (subComponent) {
        if (subComponent.asyncDep && !subComponent.asyncResolved) {
          return subComponent;
        } else {
          return locateNonHydratedAsyncRoot(subComponent);
        }
      }
    }
    function invalidateMount(hooks) {
      if (hooks) {
        for (let i = 0; i < hooks.length; i++)
          hooks[i].flags |= 8;
      }
    }
    const ssrContextKey = Symbol.for("v-scx");
    const useSSRContext = () => {
      {
        const ctx = inject(ssrContextKey);
        return ctx;
      }
    };
    function watch(source, cb, options) {
      return doWatch(source, cb, options);
    }
    function doWatch(source, cb, options = EMPTY_OBJ) {
      const { immediate, deep, flush, once } = options;
      const baseWatchOptions = extend({}, options);
      const runsImmediately = cb && immediate || !cb && flush !== "post";
      let ssrCleanup;
      if (isInSSRComponentSetup) {
        if (flush === "sync") {
          const ctx = useSSRContext();
          ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
        } else if (!runsImmediately) {
          const watchStopHandle = () => {
          };
          watchStopHandle.stop = NOOP;
          watchStopHandle.resume = NOOP;
          watchStopHandle.pause = NOOP;
          return watchStopHandle;
        }
      }
      const instance = currentInstance;
      baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
      let isPre = false;
      if (flush === "post") {
        baseWatchOptions.scheduler = (job) => {
          queuePostRenderEffect(job, instance && instance.suspense);
        };
      } else if (flush !== "sync") {
        isPre = true;
        baseWatchOptions.scheduler = (job, isFirstRun) => {
          if (isFirstRun) {
            job();
          } else {
            queueJob(job);
          }
        };
      }
      baseWatchOptions.augmentJob = (job) => {
        if (cb) {
          job.flags |= 4;
        }
        if (isPre) {
          job.flags |= 2;
          if (instance) {
            job.id = instance.uid;
            job.i = instance;
          }
        }
      };
      const watchHandle = watch$1(source, cb, baseWatchOptions);
      if (isInSSRComponentSetup) {
        if (ssrCleanup) {
          ssrCleanup.push(watchHandle);
        } else if (runsImmediately) {
          watchHandle();
        }
      }
      return watchHandle;
    }
    function instanceWatch(source, value, options) {
      const publicThis = this.proxy;
      const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
      let cb;
      if (isFunction(value)) {
        cb = value;
      } else {
        cb = value.handler;
        options = value;
      }
      const reset = setCurrentInstance(this);
      const res = doWatch(getter, cb.bind(publicThis), options);
      reset();
      return res;
    }
    function createPathGetter(ctx, path) {
      const segments = path.split(".");
      return () => {
        let cur = ctx;
        for (let i = 0; i < segments.length && cur; i++) {
          cur = cur[segments[i]];
        }
        return cur;
      };
    }
    const getModelModifiers = (props, modelName) => {
      return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
    };
    function emit(instance, event, ...rawArgs) {
      if (instance.isUnmounted) return;
      const props = instance.vnode.props || EMPTY_OBJ;
      let args = rawArgs;
      const isModelListener2 = event.startsWith("update:");
      const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
      if (modifiers) {
        if (modifiers.trim) {
          args = rawArgs.map((a) => isString(a) ? a.trim() : a);
        }
        if (modifiers.number) {
          args = rawArgs.map(looseToNumber);
        }
      }
      let handlerName;
      let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
      props[handlerName = toHandlerKey(camelize(event))];
      if (!handler && isModelListener2) {
        handler = props[handlerName = toHandlerKey(hyphenate(event))];
      }
      if (handler) {
        callWithAsyncErrorHandling(
          handler,
          instance,
          6,
          args
        );
      }
      const onceHandler = props[handlerName + `Once`];
      if (onceHandler) {
        if (!instance.emitted) {
          instance.emitted = {};
        } else if (instance.emitted[handlerName]) {
          return;
        }
        instance.emitted[handlerName] = true;
        callWithAsyncErrorHandling(
          onceHandler,
          instance,
          6,
          args
        );
      }
    }
    function normalizeEmitsOptions(comp, appContext, asMixin = false) {
      const cache = appContext.emitsCache;
      const cached = cache.get(comp);
      if (cached !== void 0) {
        return cached;
      }
      const raw = comp.emits;
      let normalized = {};
      let hasExtends = false;
      if (!isFunction(comp)) {
        const extendEmits = (raw2) => {
          const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
          if (normalizedFromExtend) {
            hasExtends = true;
            extend(normalized, normalizedFromExtend);
          }
        };
        if (!asMixin && appContext.mixins.length) {
          appContext.mixins.forEach(extendEmits);
        }
        if (comp.extends) {
          extendEmits(comp.extends);
        }
        if (comp.mixins) {
          comp.mixins.forEach(extendEmits);
        }
      }
      if (!raw && !hasExtends) {
        if (isObject(comp)) {
          cache.set(comp, null);
        }
        return null;
      }
      if (isArray(raw)) {
        raw.forEach((key) => normalized[key] = null);
      } else {
        extend(normalized, raw);
      }
      if (isObject(comp)) {
        cache.set(comp, normalized);
      }
      return normalized;
    }
    function isEmitListener(options, key) {
      if (!options || !isOn(key)) {
        return false;
      }
      key = key.slice(2).replace(/Once$/, "");
      return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
    }
    function markAttrsAccessed() {
    }
    function renderComponentRoot(instance) {
      const {
        type: Component,
        vnode,
        proxy,
        withProxy,
        propsOptions: [propsOptions],
        slots,
        attrs,
        emit: emit2,
        render,
        renderCache,
        props,
        data,
        setupState,
        ctx,
        inheritAttrs
      } = instance;
      const prev = setCurrentRenderingInstance(instance);
      let result;
      let fallthroughAttrs;
      try {
        if (vnode.shapeFlag & 4) {
          const proxyToUse = withProxy || proxy;
          const thisProxy = false ? new Proxy(proxyToUse, {
            get(target, key, receiver) {
              warn$1(
                `Property '${String(
                  key
                )}' was accessed via 'this'. Avoid using 'this' in templates.`
              );
              return Reflect.get(target, key, receiver);
            }
          }) : proxyToUse;
          result = normalizeVNode(
            render.call(
              thisProxy,
              proxyToUse,
              renderCache,
              false ? shallowReadonly(props) : props,
              setupState,
              data,
              ctx
            )
          );
          fallthroughAttrs = attrs;
        } else {
          const render2 = Component;
          if (false) ;
          result = normalizeVNode(
            render2.length > 1 ? render2(
              false ? shallowReadonly(props) : props,
              false ? {
                get attrs() {
                  markAttrsAccessed();
                  return shallowReadonly(attrs);
                },
                slots,
                emit: emit2
              } : { attrs, slots, emit: emit2 }
            ) : render2(
              false ? shallowReadonly(props) : props,
              null
            )
          );
          fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
        }
      } catch (err) {
        blockStack.length = 0;
        handleError(err, instance, 1);
        result = createVNode(Comment);
      }
      let root = result;
      if (fallthroughAttrs && inheritAttrs !== false) {
        const keys = Object.keys(fallthroughAttrs);
        const { shapeFlag } = root;
        if (keys.length) {
          if (shapeFlag & (1 | 6)) {
            if (propsOptions && keys.some(isModelListener)) {
              fallthroughAttrs = filterModelListeners(
                fallthroughAttrs,
                propsOptions
              );
            }
            root = cloneVNode(root, fallthroughAttrs, false, true);
          }
        }
      }
      if (vnode.dirs) {
        root = cloneVNode(root, null, false, true);
        root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
      }
      if (vnode.transition) {
        setTransitionHooks(root, vnode.transition);
      }
      {
        result = root;
      }
      setCurrentRenderingInstance(prev);
      return result;
    }
    const getFunctionalFallthrough = (attrs) => {
      let res;
      for (const key in attrs) {
        if (key === "class" || key === "style" || isOn(key)) {
          (res || (res = {}))[key] = attrs[key];
        }
      }
      return res;
    };
    const filterModelListeners = (attrs, props) => {
      const res = {};
      for (const key in attrs) {
        if (!isModelListener(key) || !(key.slice(9) in props)) {
          res[key] = attrs[key];
        }
      }
      return res;
    };
    function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
      const { props: prevProps, children: prevChildren, component } = prevVNode;
      const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
      const emits = component.emitsOptions;
      if (nextVNode.dirs || nextVNode.transition) {
        return true;
      }
      if (optimized && patchFlag >= 0) {
        if (patchFlag & 1024) {
          return true;
        }
        if (patchFlag & 16) {
          if (!prevProps) {
            return !!nextProps;
          }
          return hasPropsChanged(prevProps, nextProps, emits);
        } else if (patchFlag & 8) {
          const dynamicProps = nextVNode.dynamicProps;
          for (let i = 0; i < dynamicProps.length; i++) {
            const key = dynamicProps[i];
            if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
              return true;
            }
          }
        }
      } else {
        if (prevChildren || nextChildren) {
          if (!nextChildren || !nextChildren.$stable) {
            return true;
          }
        }
        if (prevProps === nextProps) {
          return false;
        }
        if (!prevProps) {
          return !!nextProps;
        }
        if (!nextProps) {
          return true;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      }
      return false;
    }
    function hasPropsChanged(prevProps, nextProps, emitsOptions) {
      const nextKeys = Object.keys(nextProps);
      if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
      }
      for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
          return true;
        }
      }
      return false;
    }
    function updateHOCHostEl({ vnode, parent }, el) {
      while (parent) {
        const root = parent.subTree;
        if (root.suspense && root.suspense.activeBranch === vnode) {
          root.el = vnode.el;
        }
        if (root === vnode) {
          (vnode = parent.vnode).el = el;
          parent = parent.parent;
        } else {
          break;
        }
      }
    }
    const isSuspense = (type) => type.__isSuspense;
    function queueEffectWithSuspense(fn, suspense) {
      if (suspense && suspense.pendingBranch) {
        if (isArray(fn)) {
          suspense.effects.push(...fn);
        } else {
          suspense.effects.push(fn);
        }
      } else {
        queuePostFlushCb(fn);
      }
    }
    const Fragment = Symbol.for("v-fgt");
    const Text = Symbol.for("v-txt");
    const Comment = Symbol.for("v-cmt");
    const Static = Symbol.for("v-stc");
    const blockStack = [];
    let currentBlock = null;
    function openBlock(disableTracking = false) {
      blockStack.push(currentBlock = disableTracking ? null : []);
    }
    function closeBlock() {
      blockStack.pop();
      currentBlock = blockStack[blockStack.length - 1] || null;
    }
    let isBlockTreeEnabled = 1;
    function setBlockTracking(value, inVOnce = false) {
      isBlockTreeEnabled += value;
      if (value < 0 && currentBlock && inVOnce) {
        currentBlock.hasOnce = true;
      }
    }
    function setupBlock(vnode) {
      vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
      closeBlock();
      if (isBlockTreeEnabled > 0 && currentBlock) {
        currentBlock.push(vnode);
      }
      return vnode;
    }
    function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
      return setupBlock(
        createBaseVNode(
          type,
          props,
          children,
          patchFlag,
          dynamicProps,
          shapeFlag,
          true
        )
      );
    }
    function createBlock(type, props, children, patchFlag, dynamicProps) {
      return setupBlock(
        createVNode(
          type,
          props,
          children,
          patchFlag,
          dynamicProps,
          true
        )
      );
    }
    function isVNode(value) {
      return value ? value.__v_isVNode === true : false;
    }
    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    const normalizeKey = ({ key }) => key != null ? key : null;
    const normalizeRef = ({
      ref: ref3,
      ref_key,
      ref_for
    }) => {
      if (typeof ref3 === "number") {
        ref3 = "" + ref3;
      }
      return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
    };
    function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
      const vnode = {
        __v_isVNode: true,
        __v_skip: true,
        type,
        props,
        key: props && normalizeKey(props),
        ref: props && normalizeRef(props),
        scopeId: currentScopeId,
        slotScopeIds: null,
        children,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetStart: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag,
        patchFlag,
        dynamicProps,
        dynamicChildren: null,
        appContext: null,
        ctx: currentRenderingInstance
      };
      if (needFullChildrenNormalization) {
        normalizeChildren(vnode, children);
        if (shapeFlag & 128) {
          type.normalize(vnode);
        }
      } else if (children) {
        vnode.shapeFlag |= isString(children) ? 8 : 16;
      }
      if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
      !isBlockNode && // has current parent block
      currentBlock && // presence of a patch flag indicates this node needs patching on updates.
      // component nodes also should always be patched, because even if the
      // component doesn't need to update, it needs to persist the instance on to
      // the next vnode so that it can be properly unmounted later.
      (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
      // vnode should not be considered dynamic due to handler caching.
      vnode.patchFlag !== 32) {
        currentBlock.push(vnode);
      }
      return vnode;
    }
    const createVNode = _createVNode;
    function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
      if (!type || type === NULL_DYNAMIC_COMPONENT) {
        type = Comment;
      }
      if (isVNode(type)) {
        const cloned = cloneVNode(
          type,
          props,
          true
          /* mergeRef: true */
        );
        if (children) {
          normalizeChildren(cloned, children);
        }
        if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
          if (cloned.shapeFlag & 6) {
            currentBlock[currentBlock.indexOf(type)] = cloned;
          } else {
            currentBlock.push(cloned);
          }
        }
        cloned.patchFlag = -2;
        return cloned;
      }
      if (isClassComponent(type)) {
        type = type.__vccOpts;
      }
      if (props) {
        props = guardReactiveProps(props);
        let { class: klass, style } = props;
        if (klass && !isString(klass)) {
          props.class = normalizeClass(klass);
        }
        if (isObject(style)) {
          if (isProxy(style) && !isArray(style)) {
            style = extend({}, style);
          }
          props.style = normalizeStyle(style);
        }
      }
      const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
      return createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        isBlockNode,
        true
      );
    }
    function guardReactiveProps(props) {
      if (!props) return null;
      return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
    }
    function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
      const { props, ref: ref3, patchFlag, children, transition } = vnode;
      const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
      const cloned = {
        __v_isVNode: true,
        __v_skip: true,
        type: vnode.type,
        props: mergedProps,
        key: mergedProps && normalizeKey(mergedProps),
        ref: extraProps && extraProps.ref ? (
          // #2078 in the case of <component :is="vnode" ref="extra"/>
          // if the vnode itself already has a ref, cloneVNode will need to merge
          // the refs so the single vnode can be set on multiple refs
          mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
        ) : ref3,
        scopeId: vnode.scopeId,
        slotScopeIds: vnode.slotScopeIds,
        children,
        target: vnode.target,
        targetStart: vnode.targetStart,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        // if the vnode is cloned with extra props, we can no longer assume its
        // existing patch flag to be reliable and need to add the FULL_PROPS flag.
        // note: preserve flag for fragments since they use the flag for children
        // fast paths only.
        patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
        dynamicProps: vnode.dynamicProps,
        dynamicChildren: vnode.dynamicChildren,
        appContext: vnode.appContext,
        dirs: vnode.dirs,
        transition,
        // These should technically only be non-null on mounted VNodes. However,
        // they *should* be copied for kept-alive vnodes. So we just always copy
        // them since them being non-null during a mount doesn't affect the logic as
        // they will simply be overwritten.
        component: vnode.component,
        suspense: vnode.suspense,
        ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
        ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
        placeholder: vnode.placeholder,
        el: vnode.el,
        anchor: vnode.anchor,
        ctx: vnode.ctx,
        ce: vnode.ce
      };
      if (transition && cloneTransition) {
        setTransitionHooks(
          cloned,
          transition.clone(cloned)
        );
      }
      return cloned;
    }
    function createTextVNode(text = " ", flag = 0) {
      return createVNode(Text, null, text, flag);
    }
    function createStaticVNode(content, numberOfNodes) {
      const vnode = createVNode(Static, null, content);
      vnode.staticCount = numberOfNodes;
      return vnode;
    }
    function createCommentVNode(text = "", asBlock = false) {
      return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
    }
    function normalizeVNode(child) {
      if (child == null || typeof child === "boolean") {
        return createVNode(Comment);
      } else if (isArray(child)) {
        return createVNode(
          Fragment,
          null,
          // #3666, avoid reference pollution when reusing vnode
          child.slice()
        );
      } else if (isVNode(child)) {
        return cloneIfMounted(child);
      } else {
        return createVNode(Text, null, String(child));
      }
    }
    function cloneIfMounted(child) {
      return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
    }
    function normalizeChildren(vnode, children) {
      let type = 0;
      const { shapeFlag } = vnode;
      if (children == null) {
        children = null;
      } else if (isArray(children)) {
        type = 16;
      } else if (typeof children === "object") {
        if (shapeFlag & (1 | 64)) {
          const slot = children.default;
          if (slot) {
            slot._c && (slot._d = false);
            normalizeChildren(vnode, slot());
            slot._c && (slot._d = true);
          }
          return;
        } else {
          type = 32;
          const slotFlag = children._;
          if (!slotFlag && !isInternalObject(children)) {
            children._ctx = currentRenderingInstance;
          } else if (slotFlag === 3 && currentRenderingInstance) {
            if (currentRenderingInstance.slots._ === 1) {
              children._ = 1;
            } else {
              children._ = 2;
              vnode.patchFlag |= 1024;
            }
          }
        }
      } else if (isFunction(children)) {
        children = { default: children, _ctx: currentRenderingInstance };
        type = 32;
      } else {
        children = String(children);
        if (shapeFlag & 64) {
          type = 16;
          children = [createTextVNode(children)];
        } else {
          type = 8;
        }
      }
      vnode.children = children;
      vnode.shapeFlag |= type;
    }
    function mergeProps(...args) {
      const ret = {};
      for (let i = 0; i < args.length; i++) {
        const toMerge = args[i];
        for (const key in toMerge) {
          if (key === "class") {
            if (ret.class !== toMerge.class) {
              ret.class = normalizeClass([ret.class, toMerge.class]);
            }
          } else if (key === "style") {
            ret.style = normalizeStyle([ret.style, toMerge.style]);
          } else if (isOn(key)) {
            const existing = ret[key];
            const incoming = toMerge[key];
            if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
              ret[key] = existing ? [].concat(existing, incoming) : incoming;
            }
          } else if (key !== "") {
            ret[key] = toMerge[key];
          }
        }
      }
      return ret;
    }
    function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
      callWithAsyncErrorHandling(hook, instance, 7, [
        vnode,
        prevVNode
      ]);
    }
    const emptyAppContext = createAppContext();
    let uid = 0;
    function createComponentInstance(vnode, parent, suspense) {
      const type = vnode.type;
      const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
      const instance = {
        uid: uid++,
        vnode,
        type,
        parent,
        appContext,
        root: null,
        // to be immediately set
        next: null,
        subTree: null,
        // will be set synchronously right after creation
        effect: null,
        update: null,
        // will be set synchronously right after creation
        job: null,
        scope: new EffectScope(
          true
          /* detached */
        ),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: parent ? parent.provides : Object.create(appContext.provides),
        ids: parent ? parent.ids : ["", 0, 0],
        accessCache: null,
        renderCache: [],
        // local resolved assets
        components: null,
        directives: null,
        // resolved props and emits options
        propsOptions: normalizePropsOptions(type, appContext),
        emitsOptions: normalizeEmitsOptions(type, appContext),
        // emit
        emit: null,
        // to be set immediately
        emitted: null,
        // props default value
        propsDefaults: EMPTY_OBJ,
        // inheritAttrs
        inheritAttrs: type.inheritAttrs,
        // state
        ctx: EMPTY_OBJ,
        data: EMPTY_OBJ,
        props: EMPTY_OBJ,
        attrs: EMPTY_OBJ,
        slots: EMPTY_OBJ,
        refs: EMPTY_OBJ,
        setupState: EMPTY_OBJ,
        setupContext: null,
        // suspense related
        suspense,
        suspenseId: suspense ? suspense.pendingId : 0,
        asyncDep: null,
        asyncResolved: false,
        // lifecycle hooks
        // not using enums here because it results in computed properties
        isMounted: false,
        isUnmounted: false,
        isDeactivated: false,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null
      };
      {
        instance.ctx = { _: instance };
      }
      instance.root = parent ? parent.root : instance;
      instance.emit = emit.bind(null, instance);
      if (vnode.ce) {
        vnode.ce(instance);
      }
      return instance;
    }
    let currentInstance = null;
    const getCurrentInstance = () => currentInstance || currentRenderingInstance;
    let internalSetCurrentInstance;
    let setInSSRSetupState;
    {
      const g = getGlobalThis();
      const registerGlobalSetter = (key, setter) => {
        let setters;
        if (!(setters = g[key])) setters = g[key] = [];
        setters.push(setter);
        return (v) => {
          if (setters.length > 1) setters.forEach((set) => set(v));
          else setters[0](v);
        };
      };
      internalSetCurrentInstance = registerGlobalSetter(
        `__VUE_INSTANCE_SETTERS__`,
        (v) => currentInstance = v
      );
      setInSSRSetupState = registerGlobalSetter(
        `__VUE_SSR_SETTERS__`,
        (v) => isInSSRComponentSetup = v
      );
    }
    const setCurrentInstance = (instance) => {
      const prev = currentInstance;
      internalSetCurrentInstance(instance);
      instance.scope.on();
      return () => {
        instance.scope.off();
        internalSetCurrentInstance(prev);
      };
    };
    const unsetCurrentInstance = () => {
      currentInstance && currentInstance.scope.off();
      internalSetCurrentInstance(null);
    };
    function isStatefulComponent(instance) {
      return instance.vnode.shapeFlag & 4;
    }
    let isInSSRComponentSetup = false;
    function setupComponent(instance, isSSR = false, optimized = false) {
      isSSR && setInSSRSetupState(isSSR);
      const { props, children } = instance.vnode;
      const isStateful = isStatefulComponent(instance);
      initProps(instance, props, isStateful, isSSR);
      initSlots(instance, children, optimized || isSSR);
      const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
      isSSR && setInSSRSetupState(false);
      return setupResult;
    }
    function setupStatefulComponent(instance, isSSR) {
      const Component = instance.type;
      instance.accessCache = /* @__PURE__ */ Object.create(null);
      instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
      const { setup } = Component;
      if (setup) {
        pauseTracking();
        const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
        const reset = setCurrentInstance(instance);
        const setupResult = callWithErrorHandling(
          setup,
          instance,
          0,
          [
            instance.props,
            setupContext
          ]
        );
        const isAsyncSetup = isPromise(setupResult);
        resetTracking();
        reset();
        if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
          markAsyncBoundary(instance);
        }
        if (isAsyncSetup) {
          setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
          if (isSSR) {
            return setupResult.then((resolvedResult) => {
              handleSetupResult(instance, resolvedResult);
            }).catch((e) => {
              handleError(e, instance, 0);
            });
          } else {
            instance.asyncDep = setupResult;
          }
        } else {
          handleSetupResult(instance, setupResult);
        }
      } else {
        finishComponentSetup(instance);
      }
    }
    function handleSetupResult(instance, setupResult, isSSR) {
      if (isFunction(setupResult)) {
        if (instance.type.__ssrInlineRender) {
          instance.ssrRender = setupResult;
        } else {
          instance.render = setupResult;
        }
      } else if (isObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
      } else ;
      finishComponentSetup(instance);
    }
    function finishComponentSetup(instance, isSSR, skipOptions) {
      const Component = instance.type;
      if (!instance.render) {
        instance.render = Component.render || NOOP;
      }
      {
        const reset = setCurrentInstance(instance);
        pauseTracking();
        try {
          applyOptions(instance);
        } finally {
          resetTracking();
          reset();
        }
      }
    }
    const attrsProxyHandlers = {
      get(target, key) {
        track(target, "get", "");
        return target[key];
      }
    };
    function createSetupContext(instance) {
      const expose = (exposed) => {
        instance.exposed = exposed || {};
      };
      {
        return {
          attrs: new Proxy(instance.attrs, attrsProxyHandlers),
          slots: instance.slots,
          emit: instance.emit,
          expose
        };
      }
    }
    function getComponentPublicInstance(instance) {
      if (instance.exposed) {
        return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
          get(target, key) {
            if (key in target) {
              return target[key];
            } else if (key in publicPropertiesMap) {
              return publicPropertiesMap[key](instance);
            }
          },
          has(target, key) {
            return key in target || key in publicPropertiesMap;
          }
        }));
      } else {
        return instance.proxy;
      }
    }
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
    function getComponentName(Component, includeInferred = true) {
      return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
    }
    function formatComponentName(instance, Component, isRoot = false) {
      let name = getComponentName(Component);
      if (!name && Component.__file) {
        const match = Component.__file.match(/([^/\\]+)\.\w+$/);
        if (match) {
          name = match[1];
        }
      }
      if (!name && instance && instance.parent) {
        const inferFromRegistry = (registry) => {
          for (const key in registry) {
            if (registry[key] === Component) {
              return key;
            }
          }
        };
        name = inferFromRegistry(
          instance.components || instance.parent.type.components
        ) || inferFromRegistry(instance.appContext.components);
      }
      return name ? classify(name) : isRoot ? `App` : `Anonymous`;
    }
    function isClassComponent(value) {
      return isFunction(value) && "__vccOpts" in value;
    }
    const computed = (getterOrOptions, debugOptions) => {
      const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
      return c;
    };
    function h(type, propsOrChildren, children) {
      const l = arguments.length;
      if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type, null, [propsOrChildren]);
          }
          return createVNode(type, propsOrChildren);
        } else {
          return createVNode(type, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type, propsOrChildren, children);
      }
    }
    const version = "3.5.18";
    /**
    * @vue/runtime-dom v3.5.18
    * (c) 2018-present Yuxi (Evan) You and Vue contributors
    * @license MIT
    **/
    let policy = void 0;
    const tt = typeof window !== "undefined" && window.trustedTypes;
    if (tt) {
      try {
        policy = /* @__PURE__ */ tt.createPolicy("vue", {
          createHTML: (val) => val
        });
      } catch (e) {
      }
    }
    const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
    const svgNS = "http://www.w3.org/2000/svg";
    const mathmlNS = "http://www.w3.org/1998/Math/MathML";
    const doc = typeof document !== "undefined" ? document : null;
    const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
    const nodeOps = {
      insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
      },
      remove: (child) => {
        const parent = child.parentNode;
        if (parent) {
          parent.removeChild(child);
        }
      },
      createElement: (tag, namespace, is, props) => {
        const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
        if (tag === "select" && props && props.multiple != null) {
          el.setAttribute("multiple", props.multiple);
        }
        return el;
      },
      createText: (text) => doc.createTextNode(text),
      createComment: (text) => doc.createComment(text),
      setText: (node, text) => {
        node.nodeValue = text;
      },
      setElementText: (el, text) => {
        el.textContent = text;
      },
      parentNode: (node) => node.parentNode,
      nextSibling: (node) => node.nextSibling,
      querySelector: (selector) => doc.querySelector(selector),
      setScopeId(el, id) {
        el.setAttribute(id, "");
      },
      // __UNSAFE__
      // Reason: innerHTML.
      // Static content here can only come from compiled templates.
      // As long as the user only uses trusted templates, this is safe.
      insertStaticContent(content, parent, anchor, namespace, start, end) {
        const before = anchor ? anchor.previousSibling : parent.lastChild;
        if (start && (start === end || start.nextSibling)) {
          while (true) {
            parent.insertBefore(start.cloneNode(true), anchor);
            if (start === end || !(start = start.nextSibling)) break;
          }
        } else {
          templateContainer.innerHTML = unsafeToTrustedHTML(
            namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
          );
          const template = templateContainer.content;
          if (namespace === "svg" || namespace === "mathml") {
            const wrapper = template.firstChild;
            while (wrapper.firstChild) {
              template.appendChild(wrapper.firstChild);
            }
            template.removeChild(wrapper);
          }
          parent.insertBefore(template, anchor);
        }
        return [
          // first
          before ? before.nextSibling : parent.firstChild,
          // last
          anchor ? anchor.previousSibling : parent.lastChild
        ];
      }
    };
    const TRANSITION = "transition";
    const ANIMATION = "animation";
    const vtcKey = Symbol("_vtc");
    const DOMTransitionPropsValidators = {
      name: String,
      type: String,
      css: {
        type: Boolean,
        default: true
      },
      duration: [String, Number, Object],
      enterFromClass: String,
      enterActiveClass: String,
      enterToClass: String,
      appearFromClass: String,
      appearActiveClass: String,
      appearToClass: String,
      leaveFromClass: String,
      leaveActiveClass: String,
      leaveToClass: String
    };
    const TransitionPropsValidators = /* @__PURE__ */ extend(
      {},
      BaseTransitionPropsValidators,
      DOMTransitionPropsValidators
    );
    const decorate$1 = (t) => {
      t.displayName = "Transition";
      t.props = TransitionPropsValidators;
      return t;
    };
    const Transition = /* @__PURE__ */ decorate$1(
      (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
    );
    const callHook = (hook, args = []) => {
      if (isArray(hook)) {
        hook.forEach((h2) => h2(...args));
      } else if (hook) {
        hook(...args);
      }
    };
    const hasExplicitCallback = (hook) => {
      return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
    };
    function resolveTransitionProps(rawProps) {
      const baseProps = {};
      for (const key in rawProps) {
        if (!(key in DOMTransitionPropsValidators)) {
          baseProps[key] = rawProps[key];
        }
      }
      if (rawProps.css === false) {
        return baseProps;
      }
      const {
        name = "v",
        type,
        duration,
        enterFromClass = `${name}-enter-from`,
        enterActiveClass = `${name}-enter-active`,
        enterToClass = `${name}-enter-to`,
        appearFromClass = enterFromClass,
        appearActiveClass = enterActiveClass,
        appearToClass = enterToClass,
        leaveFromClass = `${name}-leave-from`,
        leaveActiveClass = `${name}-leave-active`,
        leaveToClass = `${name}-leave-to`
      } = rawProps;
      const durations = normalizeDuration(duration);
      const enterDuration = durations && durations[0];
      const leaveDuration = durations && durations[1];
      const {
        onBeforeEnter,
        onEnter,
        onEnterCancelled,
        onLeave,
        onLeaveCancelled,
        onBeforeAppear = onBeforeEnter,
        onAppear = onEnter,
        onAppearCancelled = onEnterCancelled
      } = baseProps;
      const finishEnter = (el, isAppear, done, isCancelled) => {
        el._enterCancelled = isCancelled;
        removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
        removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
        done && done();
      };
      const finishLeave = (el, done) => {
        el._isLeaving = false;
        removeTransitionClass(el, leaveFromClass);
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
        done && done();
      };
      const makeEnterHook = (isAppear) => {
        return (el, done) => {
          const hook = isAppear ? onAppear : onEnter;
          const resolve = () => finishEnter(el, isAppear, done);
          callHook(hook, [el, resolve]);
          nextFrame(() => {
            removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
            addTransitionClass(el, isAppear ? appearToClass : enterToClass);
            if (!hasExplicitCallback(hook)) {
              whenTransitionEnds(el, type, enterDuration, resolve);
            }
          });
        };
      };
      return extend(baseProps, {
        onBeforeEnter(el) {
          callHook(onBeforeEnter, [el]);
          addTransitionClass(el, enterFromClass);
          addTransitionClass(el, enterActiveClass);
        },
        onBeforeAppear(el) {
          callHook(onBeforeAppear, [el]);
          addTransitionClass(el, appearFromClass);
          addTransitionClass(el, appearActiveClass);
        },
        onEnter: makeEnterHook(false),
        onAppear: makeEnterHook(true),
        onLeave(el, done) {
          el._isLeaving = true;
          const resolve = () => finishLeave(el, done);
          addTransitionClass(el, leaveFromClass);
          if (!el._enterCancelled) {
            forceReflow();
            addTransitionClass(el, leaveActiveClass);
          } else {
            addTransitionClass(el, leaveActiveClass);
            forceReflow();
          }
          nextFrame(() => {
            if (!el._isLeaving) {
              return;
            }
            removeTransitionClass(el, leaveFromClass);
            addTransitionClass(el, leaveToClass);
            if (!hasExplicitCallback(onLeave)) {
              whenTransitionEnds(el, type, leaveDuration, resolve);
            }
          });
          callHook(onLeave, [el, resolve]);
        },
        onEnterCancelled(el) {
          finishEnter(el, false, void 0, true);
          callHook(onEnterCancelled, [el]);
        },
        onAppearCancelled(el) {
          finishEnter(el, true, void 0, true);
          callHook(onAppearCancelled, [el]);
        },
        onLeaveCancelled(el) {
          finishLeave(el);
          callHook(onLeaveCancelled, [el]);
        }
      });
    }
    function normalizeDuration(duration) {
      if (duration == null) {
        return null;
      } else if (isObject(duration)) {
        return [NumberOf(duration.enter), NumberOf(duration.leave)];
      } else {
        const n = NumberOf(duration);
        return [n, n];
      }
    }
    function NumberOf(val) {
      const res = toNumber(val);
      return res;
    }
    function addTransitionClass(el, cls) {
      cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
      (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
    }
    function removeTransitionClass(el, cls) {
      cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
      const _vtc = el[vtcKey];
      if (_vtc) {
        _vtc.delete(cls);
        if (!_vtc.size) {
          el[vtcKey] = void 0;
        }
      }
    }
    function nextFrame(cb) {
      requestAnimationFrame(() => {
        requestAnimationFrame(cb);
      });
    }
    let endId = 0;
    function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
      const id = el._endId = ++endId;
      const resolveIfNotStale = () => {
        if (id === el._endId) {
          resolve();
        }
      };
      if (explicitTimeout != null) {
        return setTimeout(resolveIfNotStale, explicitTimeout);
      }
      const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
      if (!type) {
        return resolve();
      }
      const endEvent = type + "end";
      let ended = 0;
      const end = () => {
        el.removeEventListener(endEvent, onEnd);
        resolveIfNotStale();
      };
      const onEnd = (e) => {
        if (e.target === el && ++ended >= propCount) {
          end();
        }
      };
      setTimeout(() => {
        if (ended < propCount) {
          end();
        }
      }, timeout + 1);
      el.addEventListener(endEvent, onEnd);
    }
    function getTransitionInfo(el, expectedType) {
      const styles = window.getComputedStyle(el);
      const getStyleProperties = (key) => (styles[key] || "").split(", ");
      const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
      const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
      const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
      const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
      const animationTimeout = getTimeout(animationDelays, animationDurations);
      let type = null;
      let timeout = 0;
      let propCount = 0;
      if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
          type = TRANSITION;
          timeout = transitionTimeout;
          propCount = transitionDurations.length;
        }
      } else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
          type = ANIMATION;
          timeout = animationTimeout;
          propCount = animationDurations.length;
        }
      } else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
        propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
      }
      const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
        getStyleProperties(`${TRANSITION}Property`).toString()
      );
      return {
        type,
        timeout,
        propCount,
        hasTransform
      };
    }
    function getTimeout(delays, durations) {
      while (delays.length < durations.length) {
        delays = delays.concat(delays);
      }
      return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
    }
    function toMs(s) {
      if (s === "auto") return 0;
      return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
    }
    function forceReflow() {
      return document.body.offsetHeight;
    }
    function patchClass(el, value, isSVG) {
      const transitionClasses = el[vtcKey];
      if (transitionClasses) {
        value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
      }
      if (value == null) {
        el.removeAttribute("class");
      } else if (isSVG) {
        el.setAttribute("class", value);
      } else {
        el.className = value;
      }
    }
    const vShowOriginalDisplay = Symbol("_vod");
    const vShowHidden = Symbol("_vsh");
    const vShow = {
      beforeMount(el, { value }, { transition }) {
        el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
        if (transition && value) {
          transition.beforeEnter(el);
        } else {
          setDisplay(el, value);
        }
      },
      mounted(el, { value }, { transition }) {
        if (transition && value) {
          transition.enter(el);
        }
      },
      updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue) return;
        if (transition) {
          if (value) {
            transition.beforeEnter(el);
            setDisplay(el, true);
            transition.enter(el);
          } else {
            transition.leave(el, () => {
              setDisplay(el, false);
            });
          }
        } else {
          setDisplay(el, value);
        }
      },
      beforeUnmount(el, { value }) {
        setDisplay(el, value);
      }
    };
    function setDisplay(el, value) {
      el.style.display = value ? el[vShowOriginalDisplay] : "none";
      el[vShowHidden] = !value;
    }
    const CSS_VAR_TEXT = Symbol("");
    const displayRE = /(^|;)\s*display\s*:/;
    function patchStyle(el, prev, next) {
      const style = el.style;
      const isCssString = isString(next);
      let hasControlledDisplay = false;
      if (next && !isCssString) {
        if (prev) {
          if (!isString(prev)) {
            for (const key in prev) {
              if (next[key] == null) {
                setStyle(style, key, "");
              }
            }
          } else {
            for (const prevStyle of prev.split(";")) {
              const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
              if (next[key] == null) {
                setStyle(style, key, "");
              }
            }
          }
        }
        for (const key in next) {
          if (key === "display") {
            hasControlledDisplay = true;
          }
          setStyle(style, key, next[key]);
        }
      } else {
        if (isCssString) {
          if (prev !== next) {
            const cssVarText = style[CSS_VAR_TEXT];
            if (cssVarText) {
              next += ";" + cssVarText;
            }
            style.cssText = next;
            hasControlledDisplay = displayRE.test(next);
          }
        } else if (prev) {
          el.removeAttribute("style");
        }
      }
      if (vShowOriginalDisplay in el) {
        el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
        if (el[vShowHidden]) {
          style.display = "none";
        }
      }
    }
    const importantRE = /\s*!important$/;
    function setStyle(style, name, val) {
      if (isArray(val)) {
        val.forEach((v) => setStyle(style, name, v));
      } else {
        if (val == null) val = "";
        if (name.startsWith("--")) {
          style.setProperty(name, val);
        } else {
          const prefixed = autoPrefix(style, name);
          if (importantRE.test(val)) {
            style.setProperty(
              hyphenate(prefixed),
              val.replace(importantRE, ""),
              "important"
            );
          } else {
            style[prefixed] = val;
          }
        }
      }
    }
    const prefixes = ["Webkit", "Moz", "ms"];
    const prefixCache = {};
    function autoPrefix(style, rawName) {
      const cached = prefixCache[rawName];
      if (cached) {
        return cached;
      }
      let name = camelize(rawName);
      if (name !== "filter" && name in style) {
        return prefixCache[rawName] = name;
      }
      name = capitalize(name);
      for (let i = 0; i < prefixes.length; i++) {
        const prefixed = prefixes[i] + name;
        if (prefixed in style) {
          return prefixCache[rawName] = prefixed;
        }
      }
      return rawName;
    }
    const xlinkNS = "http://www.w3.org/1999/xlink";
    function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
      if (isSVG && key.startsWith("xlink:")) {
        if (value == null) {
          el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
        } else {
          el.setAttributeNS(xlinkNS, key, value);
        }
      } else {
        if (value == null || isBoolean && !includeBooleanAttr(value)) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(
            key,
            isBoolean ? "" : isSymbol(value) ? String(value) : value
          );
        }
      }
    }
    function patchDOMProp(el, key, value, parentComponent, attrName) {
      if (key === "innerHTML" || key === "textContent") {
        if (value != null) {
          el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
        }
        return;
      }
      const tag = el.tagName;
      if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
      !tag.includes("-")) {
        const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
        const newValue = value == null ? (
          // #11647: value should be set as empty string for null and undefined,
          // but <input type="checkbox"> should be set as 'on'.
          el.type === "checkbox" ? "on" : ""
        ) : String(value);
        if (oldValue !== newValue || !("_value" in el)) {
          el.value = newValue;
        }
        if (value == null) {
          el.removeAttribute(key);
        }
        el._value = value;
        return;
      }
      let needRemove = false;
      if (value === "" || value == null) {
        const type = typeof el[key];
        if (type === "boolean") {
          value = includeBooleanAttr(value);
        } else if (value == null && type === "string") {
          value = "";
          needRemove = true;
        } else if (type === "number") {
          value = 0;
          needRemove = true;
        }
      }
      try {
        el[key] = value;
      } catch (e) {
      }
      needRemove && el.removeAttribute(attrName || key);
    }
    function addEventListener(el, event, handler, options) {
      el.addEventListener(event, handler, options);
    }
    function removeEventListener(el, event, handler, options) {
      el.removeEventListener(event, handler, options);
    }
    const veiKey = Symbol("_vei");
    function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
      const invokers = el[veiKey] || (el[veiKey] = {});
      const existingInvoker = invokers[rawName];
      if (nextValue && existingInvoker) {
        existingInvoker.value = nextValue;
      } else {
        const [name, options] = parseName(rawName);
        if (nextValue) {
          const invoker = invokers[rawName] = createInvoker(
            nextValue,
            instance
          );
          addEventListener(el, name, invoker, options);
        } else if (existingInvoker) {
          removeEventListener(el, name, existingInvoker, options);
          invokers[rawName] = void 0;
        }
      }
    }
    const optionsModifierRE = /(?:Once|Passive|Capture)$/;
    function parseName(name) {
      let options;
      if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while (m = name.match(optionsModifierRE)) {
          name = name.slice(0, name.length - m[0].length);
          options[m[0].toLowerCase()] = true;
        }
      }
      const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
      return [event, options];
    }
    let cachedNow = 0;
    const p = /* @__PURE__ */ Promise.resolve();
    const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
    function createInvoker(initialValue, instance) {
      const invoker = (e) => {
        if (!e._vts) {
          e._vts = Date.now();
        } else if (e._vts <= invoker.attached) {
          return;
        }
        callWithAsyncErrorHandling(
          patchStopImmediatePropagation(e, invoker.value),
          instance,
          5,
          [e]
        );
      };
      invoker.value = initialValue;
      invoker.attached = getNow();
      return invoker;
    }
    function patchStopImmediatePropagation(e, value) {
      if (isArray(value)) {
        const originalStop = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
          originalStop.call(e);
          e._stopped = true;
        };
        return value.map(
          (fn) => (e2) => !e2._stopped && fn && fn(e2)
        );
      } else {
        return value;
      }
    }
    const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
    key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
    const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
      const isSVG = namespace === "svg";
      if (key === "class") {
        patchClass(el, nextValue, isSVG);
      } else if (key === "style") {
        patchStyle(el, prevValue, nextValue);
      } else if (isOn(key)) {
        if (!isModelListener(key)) {
          patchEvent(el, key, prevValue, nextValue, parentComponent);
        }
      } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
        patchDOMProp(el, key, nextValue);
        if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
          patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
        }
      } else if (
        // #11081 force set props for possible async custom element
        el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
      ) {
        patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
      } else {
        if (key === "true-value") {
          el._trueValue = nextValue;
        } else if (key === "false-value") {
          el._falseValue = nextValue;
        }
        patchAttr(el, key, nextValue, isSVG);
      }
    };
    function shouldSetAsProp(el, key, value, isSVG) {
      if (isSVG) {
        if (key === "innerHTML" || key === "textContent") {
          return true;
        }
        if (key in el && isNativeOn(key) && isFunction(value)) {
          return true;
        }
        return false;
      }
      if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
        return false;
      }
      if (key === "form") {
        return false;
      }
      if (key === "list" && el.tagName === "INPUT") {
        return false;
      }
      if (key === "type" && el.tagName === "TEXTAREA") {
        return false;
      }
      if (key === "width" || key === "height") {
        const tag = el.tagName;
        if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
          return false;
        }
      }
      if (isNativeOn(key) && isString(value)) {
        return false;
      }
      return key in el;
    }
    const getModelAssigner = (vnode) => {
      const fn = vnode.props["onUpdate:modelValue"] || false;
      return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
    };
    function onCompositionStart(e) {
      e.target.composing = true;
    }
    function onCompositionEnd(e) {
      const target = e.target;
      if (target.composing) {
        target.composing = false;
        target.dispatchEvent(new Event("input"));
      }
    }
    const assignKey = Symbol("_assign");
    const vModelText = {
      created(el, { modifiers: { lazy, trim, number } }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        const castToNumber = number || vnode.props && vnode.props.type === "number";
        addEventListener(el, lazy ? "change" : "input", (e) => {
          if (e.target.composing) return;
          let domValue = el.value;
          if (trim) {
            domValue = domValue.trim();
          }
          if (castToNumber) {
            domValue = looseToNumber(domValue);
          }
          el[assignKey](domValue);
        });
        if (trim) {
          addEventListener(el, "change", () => {
            el.value = el.value.trim();
          });
        }
        if (!lazy) {
          addEventListener(el, "compositionstart", onCompositionStart);
          addEventListener(el, "compositionend", onCompositionEnd);
          addEventListener(el, "change", onCompositionEnd);
        }
      },
      // set value on mounted so it's after min/max for type="range"
      mounted(el, { value }) {
        el.value = value == null ? "" : value;
      },
      beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        if (el.composing) return;
        const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
        const newValue = value == null ? "" : value;
        if (elValue === newValue) {
          return;
        }
        if (document.activeElement === el && el.type !== "range") {
          if (lazy && value === oldValue) {
            return;
          }
          if (trim && el.value.trim() === newValue) {
            return;
          }
        }
        el.value = newValue;
      }
    };
    const vModelCheckbox = {
      // #4096 array checkboxes need to be deep traversed
      deep: true,
      created(el, _, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        addEventListener(el, "change", () => {
          const modelValue = el._modelValue;
          const elementValue = getValue(el);
          const checked = el.checked;
          const assign = el[assignKey];
          if (isArray(modelValue)) {
            const index = looseIndexOf(modelValue, elementValue);
            const found = index !== -1;
            if (checked && !found) {
              assign(modelValue.concat(elementValue));
            } else if (!checked && found) {
              const filtered = [...modelValue];
              filtered.splice(index, 1);
              assign(filtered);
            }
          } else if (isSet(modelValue)) {
            const cloned = new Set(modelValue);
            if (checked) {
              cloned.add(elementValue);
            } else {
              cloned.delete(elementValue);
            }
            assign(cloned);
          } else {
            assign(getCheckboxValue(el, checked));
          }
        });
      },
      // set initial checked on mount to wait for true-value/false-value
      mounted: setChecked,
      beforeUpdate(el, binding, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        setChecked(el, binding, vnode);
      }
    };
    function setChecked(el, { value, oldValue }, vnode) {
      el._modelValue = value;
      let checked;
      if (isArray(value)) {
        checked = looseIndexOf(value, vnode.props.value) > -1;
      } else if (isSet(value)) {
        checked = value.has(vnode.props.value);
      } else {
        if (value === oldValue) return;
        checked = looseEqual(value, getCheckboxValue(el, true));
      }
      if (el.checked !== checked) {
        el.checked = checked;
      }
    }
    const vModelRadio = {
      created(el, { value }, vnode) {
        el.checked = looseEqual(value, vnode.props.value);
        el[assignKey] = getModelAssigner(vnode);
        addEventListener(el, "change", () => {
          el[assignKey](getValue(el));
        });
      },
      beforeUpdate(el, { value, oldValue }, vnode) {
        el[assignKey] = getModelAssigner(vnode);
        if (value !== oldValue) {
          el.checked = looseEqual(value, vnode.props.value);
        }
      }
    };
    const vModelSelect = {
      // <select multiple> value need to be deep traversed
      deep: true,
      created(el, { value, modifiers: { number } }, vnode) {
        const isSetModel = isSet(value);
        addEventListener(el, "change", () => {
          const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
            (o) => number ? looseToNumber(getValue(o)) : getValue(o)
          );
          el[assignKey](
            el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
          );
          el._assigning = true;
          nextTick(() => {
            el._assigning = false;
          });
        });
        el[assignKey] = getModelAssigner(vnode);
      },
      // set value in mounted & updated because <select> relies on its children
      // <option>s.
      mounted(el, { value }) {
        setSelected(el, value);
      },
      beforeUpdate(el, _binding, vnode) {
        el[assignKey] = getModelAssigner(vnode);
      },
      updated(el, { value }) {
        if (!el._assigning) {
          setSelected(el, value);
        }
      }
    };
    function setSelected(el, value) {
      const isMultiple = el.multiple;
      const isArrayValue = isArray(value);
      if (isMultiple && !isArrayValue && !isSet(value)) {
        return;
      }
      for (let i = 0, l = el.options.length; i < l; i++) {
        const option = el.options[i];
        const optionValue = getValue(option);
        if (isMultiple) {
          if (isArrayValue) {
            const optionType = typeof optionValue;
            if (optionType === "string" || optionType === "number") {
              option.selected = value.some((v) => String(v) === String(optionValue));
            } else {
              option.selected = looseIndexOf(value, optionValue) > -1;
            }
          } else {
            option.selected = value.has(optionValue);
          }
        } else if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) el.selectedIndex = i;
          return;
        }
      }
      if (!isMultiple && el.selectedIndex !== -1) {
        el.selectedIndex = -1;
      }
    }
    function getValue(el) {
      return "_value" in el ? el._value : el.value;
    }
    function getCheckboxValue(el, checked) {
      const key = checked ? "_trueValue" : "_falseValue";
      return key in el ? el[key] : checked;
    }
    const vModelDynamic = {
      created(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, "created");
      },
      mounted(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, "mounted");
      },
      beforeUpdate(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
      },
      updated(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, "updated");
      }
    };
    function resolveDynamicModel(tagName, type) {
      switch (tagName) {
        case "SELECT":
          return vModelSelect;
        case "TEXTAREA":
          return vModelText;
        default:
          switch (type) {
            case "checkbox":
              return vModelCheckbox;
            case "radio":
              return vModelRadio;
            default:
              return vModelText;
          }
      }
    }
    function callModelHook(el, binding, vnode, prevVNode, hook) {
      const modelToUse = resolveDynamicModel(
        el.tagName,
        vnode.props && vnode.props.type
      );
      const fn = modelToUse[hook];
      fn && fn(el, binding, vnode, prevVNode);
    }
    const systemModifiers = ["ctrl", "shift", "alt", "meta"];
    const modifierGuards = {
      stop: (e) => e.stopPropagation(),
      prevent: (e) => e.preventDefault(),
      self: (e) => e.target !== e.currentTarget,
      ctrl: (e) => !e.ctrlKey,
      shift: (e) => !e.shiftKey,
      alt: (e) => !e.altKey,
      meta: (e) => !e.metaKey,
      left: (e) => "button" in e && e.button !== 0,
      middle: (e) => "button" in e && e.button !== 1,
      right: (e) => "button" in e && e.button !== 2,
      exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
    };
    const withModifiers = (fn, modifiers) => {
      const cache = fn._withMods || (fn._withMods = {});
      const cacheKey = modifiers.join(".");
      return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
        for (let i = 0; i < modifiers.length; i++) {
          const guard = modifierGuards[modifiers[i]];
          if (guard && guard(event, modifiers)) return;
        }
        return fn(event, ...args);
      });
    };
    const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
    let renderer;
    function ensureRenderer() {
      return renderer || (renderer = createRenderer(rendererOptions));
    }
    const createApp = (...args) => {
      const app = ensureRenderer().createApp(...args);
      const { mount } = app;
      app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (!container) return;
        const component = app._component;
        if (!isFunction(component) && !component.render && !component.template) {
          component.template = container.innerHTML;
        }
        if (container.nodeType === 1) {
          container.textContent = "";
        }
        const proxy = mount(container, false, resolveRootNamespace(container));
        if (container instanceof Element) {
          container.removeAttribute("v-cloak");
          container.setAttribute("data-v-app", "");
        }
        return proxy;
      };
      return app;
    };
    function resolveRootNamespace(container) {
      if (container instanceof SVGElement) {
        return "svg";
      }
      if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
        return "mathml";
      }
    }
    function normalizeContainer(container) {
      if (isString(container)) {
        const res = document.querySelector(container);
        return res;
      }
      return container;
    }
    const _export_sfc = (sfc, props) => {
      const target = sfc.__vccOpts || sfc;
      for (const [key, val] of props) {
        target[key] = val;
      }
      return target;
    };
    const _sfc_main$g = {};
    const _hoisted_1$g = {
      class: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16"
    };
    function _sfc_render$7(_ctx, _cache) {
      return openBlock(), createElementBlock("svg", _hoisted_1$g, _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          d: "M480 128a352.128 352.128 0 0 1 343.872 276.544l7.68 3.328 11.52 5.44 11.52 6.208 7.872 4.736 15.36 10.176 3.328 2.368a280.32 280.32 0 0 1 41.728 38.016l11.392 13.568 6.272 8.32 8.32 12.16 8.128 13.504 8.064 15.488 5.44 11.968 4.544 11.456 4.8 14.08 5.248 19.648 2.56 12.16 2.24 15.04 1.536 16.064L992 656l-0.128 8.832-0.832 14.016-1.92 16.96-2.24 12.8-1.92 9.088a254.976 254.976 0 0 1-11.52 37.12l-5.056 12.16-6.336 13.248-8.384 15.168-9.472 14.72-11.328 15.232-11.52 13.568a271.296 271.296 0 0 1-188.16 88.768L720 928H256l-12.288-0.32a224 224 0 0 1-113.6-408.96A352 352 0 0 1 480 128z m0 64a288 288 0 0 0-288 288l0.448 16 1.28 15.68 4.224 38.272-31.808 21.632A159.744 159.744 0 0 0 96 704c0 81.536 61.184 149.312 139.2 158.784l10.24 0.896L256 864h462.464l11.648-0.256A207.296 207.296 0 0 0 902.336 756.16l3.2-6.08 5.888-12.608a206.72 206.72 0 0 0 7.68-21.248l2.88-10.368 2.496-11.52 1.92-12.096 1.216-13.056 0.256-6.4a209.28 209.28 0 0 0-0.448-22.144l-1.28-12.288-1.408-9.088a207.488 207.488 0 0 0-21.888-62.464l-6.016-10.368-7.04-10.56-7.104-9.6 3.84 5.12a209.536 209.536 0 0 0-30.464-32.768l-7.744-6.4-8.704-6.4-9.6-6.4-10.752-6.272a208.128 208.128 0 0 0-237.12 27.072l-9.216 8.704-45.248-45.248a271.488 271.488 0 0 1 224.512-77.76A288 288 0 0 0 480 192z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
    const NetdiskIcon = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$7]]);
    const _sfc_main$f = {};
    const _hoisted_1$f = {
      class: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16"
    };
    function _sfc_render$6(_ctx, _cache) {
      return openBlock(), createElementBlock("svg", _hoisted_1$f, _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          d: "M0 0h1024v1024H0z",
          "fill-opacity": "0"
        }, null, -1),
        createBaseVNode("path", {
          d: "M807.36 96a99.2 99.2 0 0 1 98.24 84.992l0.96 9.28 0.128 4.48V558.08c0 197.12-155.52 358.592-352 369.408l-14.08 0.512-6.656 0.064c-198.464 0-361.216-154.24-372.096-349.44l-0.512-14.016-0.128-238.656-0.256-0.96a60.416 60.416 0 0 1-0.832-14.464l0.832-7.168 0.256-1.024v-107.52c0-46.336 32.192-85.44 76.544-96l8.96-1.728 9.344-0.896 62.208-0.128a99.2 99.2 0 0 1 98.24 84.992l0.96 9.28 0.064 4.48V558.08c0 63.552 52.096 115.2 116.48 115.2 58.24 0 107.072-42.688 115.136-97.92l0.96-9.344 0.192-3.84v-367.36c0-49.408 36.608-90.624 85.504-97.728l9.344-0.896 62.208-0.128zM353.536 405.312H225.216l0.128 158.336c2.944 161.92 132.672 292.864 294.4 300.032l13.952 0.32h6.016c163.456-3.008 295.424-131.712 302.656-292.16l0.32-13.824-0.064-152.704H714.24v158.784l-0.256 5.248c-5.76 94.08-84.672 167.872-180.032 167.872a179.904 179.904 0 0 1-180.032-168.32l-0.384-10.88V405.312zM807.36 160h-59.648a35.136 35.136 0 0 0-32.832 28.8l-0.512 5.952L714.24 320 830.464 320l3.84 0.128c3.072 0.192 5.888 0.64 8.32 1.28V192.96a35.008 35.008 0 0 0-29.12-32.384l-6.144-0.512z m-489.088 0H258.56a35.136 35.136 0 0 0-32.832 28.8l-0.512 5.952v110.912l-1.28 8.32 0.832 5.952L341.312 320l3.84 0.128c3.136 0.192 5.952 0.64 8.384 1.28V192.96a35.008 35.008 0 0 0-29.184-32.384L318.272 160z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
    const BtIcon = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$6]]);
    const _sfc_main$e = {};
    const _hoisted_1$e = {
      xmlns: "http://www.w3.org/2000/svg",
      class: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      width: "16",
      height: "16"
    };
    function _sfc_render$5(_ctx, _cache) {
      return openBlock(), createElementBlock("svg", _hoisted_1$e, _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          d: "M 693.347 15.431 L 691.961 14.565 L 690.543 13.774 L 689.095 13.059 L 687.621 12.418 L 686.123 11.853 L 684.603 11.363 L 683.065 10.947 L 681.511 10.608 L 679.944 10.343 L 678.368 10.154 L 676.785 10.041 L 675.199 10.003 L 673.614 10.041 L 672.031 10.154 L 670.455 10.343 L 668.888 10.608 L 667.334 10.947 L 665.796 11.363 L 664.276 11.853 L 662.778 12.418 L 661.304 13.059 L 659.856 13.774 L 658.438 14.565 L 657.052 15.431 L 655.699 16.374 L 654.383 17.394 L 653.105 18.491 L 651.776 19.754 L 650.430 21.101 L 648.994 22.536 L 647.559 23.972 L 646.123 25.407 L 644.688 26.843 L 643.252 28.278 L 641.817 29.714 L 640.381 31.149 L 638.946 32.585 L 637.510 34.020 L 636.075 35.456 L 634.639 36.891 L 633.204 38.327 L 631.768 39.762 L 630.333 41.198 L 628.897 42.633 L 627.462 44.069 L 626.026 45.504 L 624.591 46.940 L 623.155 48.375 L 621.720 49.811 L 620.284 51.246 L 618.849 52.682 L 617.413 54.117 L 615.978 55.553 L 614.542 56.988 L 611.671 59.859 L 610.236 61.295 L 607.365 64.166 L 605.929 65.601 L 604.494 67.037 L 603.059 68.472 L 601.623 69.908 L 598.752 72.779 L 597.317 74.214 L 594.446 77.085 L 593.010 78.521 L 590.139 81.392 L 588.704 82.828 L 587.268 84.263 L 585.833 85.699 L 584.397 87.134 L 582.962 88.570 L 581.526 90.005 L 580.091 91.441 L 578.655 92.876 L 577.220 94.312 L 575.784 95.747 L 572.913 98.618 L 571.478 100.054 L 570.042 101.489 L 568.607 102.925 L 567.171 104.360 L 564.300 107.231 L 562.865 108.667 L 559.994 111.538 L 558.558 112.973 L 555.687 115.844 L 554.252 117.280 L 551.381 120.151 L 549.945 121.586 L 547.074 124.457 L 545.639 125.893 L 542.768 128.764 L 541.332 130.199 L 538.462 133.070 L 537.026 134.506 L 534.155 137.377 L 532.720 138.812 L 529.849 141.683 L 528.413 143.119 L 525.542 145.990 L 524.107 147.426 L 522.671 148.861 L 521.944 149.520 L 521.156 150.105 L 520.314 150.609 L 519.427 151.029 L 518.503 151.359 L 517.551 151.598 L 516.580 151.742 L 515.600 151.790 L 514.620 151.742 L 513.649 151.598 L 512.697 151.359 L 511.773 151.029 L 510.886 150.609 L 510.044 150.105 L 509.256 149.520 L 508.529 148.861 L 507.093 147.426 L 505.658 145.990 L 504.222 144.554 L 502.787 143.119 L 501.351 141.683 L 499.916 140.248 L 498.480 138.812 L 497.045 137.377 L 495.609 135.941 L 494.174 134.506 L 492.738 133.070 L 491.303 131.635 L 489.868 130.199 L 486.997 127.328 L 485.561 125.893 L 482.690 123.022 L 481.255 121.586 L 479.819 120.151 L 478.384 118.715 L 476.948 117.280 L 475.513 115.844 L 474.077 114.409 L 472.642 112.973 L 471.206 111.538 L 469.771 110.102 L 468.335 108.667 L 466.900 107.231 L 465.464 105.796 L 464.029 104.360 L 462.593 102.925 L 461.158 101.489 L 459.722 100.054 L 458.287 98.618 L 456.851 97.183 L 455.416 95.747 L 453.980 94.312 L 451.109 91.441 L 449.674 90.005 L 446.803 87.134 L 445.367 85.699 L 443.932 84.263 L 442.496 82.828 L 441.061 81.392 L 439.625 79.956 L 438.190 78.521 L 436.754 77.085 L 433.883 74.214 L 432.448 72.779 L 431.012 71.343 L 429.577 69.908 L 428.141 68.472 L 426.706 67.037 L 425.271 65.601 L 423.835 64.166 L 422.400 62.730 L 420.964 61.295 L 419.529 59.859 L 418.093 58.424 L 416.658 56.988 L 415.222 55.553 L 413.787 54.117 L 412.351 52.682 L 410.916 51.246 L 409.480 49.811 L 406.609 46.940 L 405.174 45.504 L 402.303 42.633 L 400.867 41.198 L 397.996 38.327 L 396.561 36.891 L 393.690 34.020 L 392.254 32.585 L 390.819 31.149 L 389.383 29.714 L 387.948 28.278 L 386.512 26.843 L 385.077 25.407 L 383.641 23.972 L 382.206 22.536 L 380.770 21.101 L 379.424 19.755 L 378.095 18.491 L 376.817 17.394 L 375.501 16.374 L 374.148 15.432 L 372.762 14.565 L 371.343 13.774 L 369.896 13.059 L 368.422 12.418 L 366.923 11.853 L 365.403 11.363 L 363.865 10.947 L 362.311 10.608 L 360.745 10.343 L 359.168 10.154 L 357.586 10.041 L 356.000 10.003 L 354.414 10.041 L 352.832 10.154 L 351.255 10.343 L 349.689 10.608 L 348.135 10.947 L 346.597 11.363 L 345.077 11.853 L 343.578 12.418 L 342.104 13.059 L 340.657 13.774 L 339.238 14.565 L 337.852 15.432 L 336.499 16.374 L 335.183 17.394 L 333.905 18.491 L 332.667 19.667 L 331.491 20.905 L 330.394 22.183 L 329.374 23.499 L 328.432 24.852 L 327.565 26.238 L 326.774 27.657 L 326.059 29.104 L 325.418 30.578 L 324.853 32.077 L 324.363 33.597 L 323.947 35.135 L 323.608 36.689 L 323.343 38.255 L 323.154 39.832 L 323.041 41.414 L 323.003 43.000 L 323.041 44.586 L 323.154 46.168 L 323.343 47.745 L 323.608 49.311 L 323.947 50.865 L 324.363 52.403 L 324.853 53.923 L 325.418 55.422 L 326.059 56.896 L 326.774 58.343 L 327.565 59.762 L 328.432 61.148 L 329.374 62.501 L 330.394 63.817 L 331.491 65.095 L 332.755 66.424 L 338.526 72.196 L 339.992 73.662 L 341.457 75.127 L 342.923 76.592 L 344.388 78.058 L 345.853 79.523 L 348.784 82.454 L 350.249 83.919 L 360.507 94.176 L 361.972 95.642 L 366.368 100.038 L 367.834 101.503 L 369.299 102.969 L 370.764 104.434 L 372.230 105.899 L 373.695 107.365 L 381.022 114.691 L 382.487 116.157 L 386.883 120.553 L 388.349 122.018 L 400.072 133.741 L 401.537 135.206 L 403.002 136.671 L 404.468 138.137 L 413.260 146.929 L 413.919 147.656 L 414.504 148.444 L 415.008 149.286 L 415.428 150.173 L 415.758 151.097 L 415.997 152.049 L 416.141 153.020 L 416.189 154.000 L 416.141 154.980 L 415.997 155.951 L 415.758 156.903 L 415.428 157.827 L 415.008 158.714 L 414.504 159.556 L 413.919 160.344 L 413.260 161.071 L 412.533 161.730 L 411.745 162.315 L 410.903 162.819 L 410.016 163.239 L 409.092 163.569 L 408.140 163.808 L 407.169 163.952 L 406.189 164.000 L 283.018 164.000 L 280.953 164.008 L 278.911 164.030 L 276.872 164.067 L 274.836 164.120 L 272.805 164.187 L 270.777 164.269 L 268.754 164.365 L 266.734 164.476 L 264.718 164.602 L 262.706 164.742 L 260.699 164.897 L 258.696 165.067 L 256.696 165.250 L 254.701 165.448 L 252.711 165.660 L 250.725 165.887 L 248.743 166.128 L 246.765 166.382 L 244.792 166.651 L 242.824 166.934 L 240.860 167.231 L 238.901 167.542 L 236.947 167.866 L 234.997 168.205 L 233.052 168.557 L 231.112 168.923 L 229.177 169.302 L 227.247 169.696 L 225.322 170.102 L 223.402 170.523 L 221.487 170.956 L 219.577 171.403 L 217.672 171.864 L 215.772 172.337 L 213.878 172.824 L 211.989 173.324 L 210.106 173.837 L 208.228 174.364 L 206.355 174.903 L 204.488 175.455 L 202.627 176.021 L 200.771 176.599 L 198.921 177.190 L 197.077 177.793 L 195.238 178.410 L 193.405 179.039 L 191.579 179.681 L 189.758 180.335 L 187.943 181.002 L 186.134 181.681 L 184.331 182.373 L 182.535 183.077 L 180.744 183.793 L 178.960 184.522 L 177.182 185.262 L 175.411 186.015 L 173.646 186.781 L 171.887 187.558 L 170.135 188.347 L 168.390 189.148 L 166.651 189.961 L 164.919 190.786 L 163.193 191.622 L 161.474 192.471 L 159.762 193.331 L 158.057 194.202 L 156.359 195.086 L 154.668 195.980 L 152.984 196.887 L 151.307 197.804 L 149.637 198.733 L 147.974 199.674 L 146.318 200.626 L 144.670 201.589 L 143.029 202.563 L 141.396 203.548 L 139.770 204.544 L 138.151 205.551 L 136.540 206.570 L 134.937 207.599 L 133.341 208.639 L 131.753 209.690 L 130.173 210.751 L 128.600 211.824 L 127.036 212.907 L 125.479 214.000 L 123.930 215.104 L 122.390 216.219 L 120.857 217.344 L 119.333 218.480 L 117.816 219.625 L 116.308 220.781 L 114.809 221.948 L 113.317 223.124 L 111.834 224.311 L 110.360 225.508 L 108.893 226.714 L 107.436 227.931 L 105.987 229.158 L 104.547 230.394 L 103.115 231.640 L 101.692 232.896 L 100.278 234.162 L 98.873 235.438 L 97.477 236.723 L 96.090 238.017 L 94.712 239.321 L 93.342 240.635 L 91.982 241.958 L 90.632 243.290 L 89.290 244.632 L 87.958 245.982 L 86.635 247.342 L 85.321 248.712 L 84.017 250.090 L 82.723 251.477 L 81.438 252.873 L 80.162 254.278 L 78.896 255.692 L 77.640 257.115 L 76.394 258.547 L 75.158 259.987 L 73.931 261.436 L 72.714 262.893 L 71.508 264.360 L 70.311 265.834 L 69.124 267.317 L 67.948 268.809 L 66.781 270.308 L 65.625 271.816 L 64.480 273.333 L 63.344 274.857 L 62.219 276.390 L 61.104 277.930 L 60.000 279.479 L 58.907 281.036 L 57.824 282.600 L 56.751 284.173 L 55.690 285.753 L 54.639 287.341 L 53.599 288.937 L 52.570 290.540 L 51.551 292.151 L 50.544 293.770 L 49.548 295.396 L 48.563 297.029 L 47.589 298.670 L 46.626 300.318 L 45.674 301.974 L 44.733 303.637 L 43.804 305.307 L 42.887 306.984 L 41.980 308.668 L 41.086 310.359 L 40.202 312.057 L 39.331 313.762 L 38.471 315.474 L 37.622 317.193 L 36.786 318.919 L 35.961 320.651 L 35.148 322.390 L 34.347 324.135 L 33.558 325.887 L 32.781 327.646 L 32.015 329.411 L 31.262 331.182 L 30.522 332.960 L 29.793 334.744 L 29.077 336.535 L 28.373 338.331 L 27.681 340.134 L 27.002 341.943 L 26.335 343.758 L 25.681 345.579 L 25.039 347.405 L 24.410 349.238 L 23.793 351.077 L 23.190 352.921 L 22.599 354.771 L 22.021 356.627 L 21.455 358.488 L 20.903 360.355 L 20.364 362.228 L 19.837 364.106 L 19.324 365.989 L 18.824 367.878 L 18.337 369.772 L 17.864 371.672 L 17.403 373.577 L 16.956 375.487 L 16.523 377.402 L 16.102 379.322 L 15.696 381.247 L 15.302 383.177 L 14.923 385.112 L 14.557 387.052 L 14.205 388.997 L 13.866 390.947 L 13.542 392.901 L 13.231 394.860 L 12.934 396.824 L 12.651 398.792 L 12.382 400.765 L 12.128 402.743 L 11.887 404.725 L 11.660 406.711 L 11.448 408.701 L 11.250 410.696 L 11.067 412.696 L 10.897 414.699 L 10.742 416.706 L 10.602 418.718 L 10.476 420.734 L 10.365 422.754 L 10.269 424.777 L 10.187 426.805 L 10.120 428.836 L 10.067 430.872 L 10.030 432.911 L 10.008 434.953 L 10.000 437.018 L 10.000 740.982 L 10.008 743.047 L 10.030 745.089 L 10.067 747.128 L 10.120 749.164 L 10.187 751.195 L 10.269 753.223 L 10.365 755.246 L 10.476 757.266 L 10.602 759.282 L 10.742 761.294 L 10.897 763.301 L 11.067 765.304 L 11.250 767.304 L 11.448 769.299 L 11.660 771.289 L 11.887 773.275 L 12.128 775.257 L 12.382 777.235 L 12.651 779.208 L 12.934 781.176 L 13.231 783.140 L 13.542 785.099 L 13.866 787.053 L 14.205 789.003 L 14.557 790.948 L 14.923 792.888 L 15.302 794.823 L 15.696 796.753 L 16.102 798.678 L 16.523 800.598 L 16.956 802.513 L 17.403 804.423 L 17.864 806.328 L 18.337 808.228 L 18.824 810.122 L 19.324 812.011 L 19.837 813.894 L 20.364 815.772 L 20.903 817.645 L 21.455 819.512 L 22.021 821.373 L 22.599 823.229 L 23.190 825.079 L 23.793 826.923 L 24.410 828.762 L 25.039 830.595 L 25.681 832.421 L 26.335 834.242 L 27.002 836.057 L 27.681 837.866 L 28.373 839.669 L 29.077 841.465 L 29.793 843.256 L 30.522 845.040 L 31.262 846.818 L 32.015 848.589 L 32.781 850.354 L 33.558 852.113 L 34.347 853.865 L 35.148 855.610 L 35.961 857.349 L 36.786 859.081 L 37.622 860.807 L 38.471 862.526 L 39.331 864.238 L 40.202 865.943 L 41.086 867.641 L 41.980 869.332 L 42.887 871.016 L 43.804 872.693 L 44.733 874.363 L 45.674 876.026 L 46.626 877.682 L 47.589 879.330 L 48.563 880.971 L 49.548 882.604 L 50.544 884.230 L 51.551 885.849 L 52.570 887.460 L 53.599 889.063 L 54.639 890.659 L 55.690 892.247 L 56.751 893.827 L 57.824 895.400 L 58.907 896.964 L 60.000 898.521 L 61.104 900.070 L 62.219 901.610 L 63.344 903.143 L 64.480 904.667 L 65.625 906.184 L 66.781 907.692 L 67.948 909.191 L 69.124 910.683 L 70.311 912.166 L 71.508 913.640 L 72.714 915.107 L 73.931 916.564 L 75.158 918.013 L 76.394 919.453 L 77.640 920.885 L 78.896 922.308 L 80.162 923.722 L 81.438 925.127 L 82.723 926.523 L 84.017 927.910 L 85.321 929.288 L 86.635 930.658 L 87.958 932.018 L 89.290 933.368 L 90.632 934.710 L 91.982 936.042 L 93.342 937.365 L 94.712 938.679 L 96.090 939.983 L 97.477 941.277 L 98.873 942.562 L 100.278 943.838 L 101.692 945.104 L 103.115 946.360 L 104.547 947.606 L 105.987 948.842 L 107.436 950.069 L 108.893 951.286 L 110.360 952.492 L 111.834 953.689 L 113.317 954.876 L 114.809 956.052 L 116.308 957.219 L 117.816 958.375 L 119.333 959.520 L 120.857 960.656 L 122.390 961.781 L 123.930 962.896 L 125.479 964.000 L 127.036 965.093 L 128.600 966.176 L 130.173 967.249 L 131.753 968.310 L 133.341 969.361 L 134.937 970.401 L 136.540 971.430 L 138.151 972.449 L 139.770 973.456 L 141.396 974.452 L 143.029 975.437 L 144.670 976.411 L 146.318 977.374 L 147.974 978.326 L 149.637 979.267 L 151.307 980.196 L 152.984 981.113 L 154.668 982.020 L 156.359 982.914 L 158.057 983.798 L 159.762 984.669 L 161.474 985.529 L 163.193 986.378 L 164.919 987.214 L 166.651 988.039 L 168.390 988.852 L 170.135 989.653 L 171.887 990.442 L 173.646 991.219 L 175.411 991.985 L 177.182 992.738 L 178.960 993.478 L 180.744 994.207 L 182.535 994.923 L 184.331 995.627 L 186.134 996.319 L 187.943 996.998 L 189.758 997.665 L 191.579 998.319 L 193.405 998.961 L 195.238 999.590 L 197.077 1000.207 L 198.921 1000.810 L 200.771 1001.401 L 202.627 1001.979 L 204.488 1002.545 L 206.355 1003.097 L 208.228 1003.636 L 210.106 1004.163 L 211.989 1004.676 L 213.878 1005.176 L 215.772 1005.663 L 217.672 1006.136 L 219.577 1006.597 L 221.487 1007.044 L 223.402 1007.477 L 225.322 1007.898 L 227.247 1008.304 L 229.177 1008.698 L 231.112 1009.077 L 233.052 1009.443 L 234.997 1009.795 L 236.947 1010.134 L 238.901 1010.458 L 240.860 1010.769 L 242.824 1011.066 L 244.792 1011.349 L 246.765 1011.618 L 248.743 1011.872 L 250.725 1012.113 L 252.711 1012.340 L 254.701 1012.552 L 256.696 1012.750 L 258.696 1012.933 L 260.699 1013.103 L 262.706 1013.258 L 264.718 1013.398 L 266.734 1013.524 L 268.754 1013.635 L 270.777 1013.731 L 272.805 1013.813 L 274.836 1013.880 L 276.872 1013.933 L 278.911 1013.970 L 280.953 1013.992 L 283.018 1014.000 L 740.982 1014.000 L 743.047 1013.992 L 745.089 1013.970 L 747.128 1013.933 L 749.164 1013.880 L 751.195 1013.813 L 753.223 1013.731 L 755.246 1013.635 L 757.266 1013.524 L 759.282 1013.398 L 761.294 1013.258 L 763.301 1013.103 L 765.304 1012.933 L 767.304 1012.750 L 769.299 1012.552 L 771.289 1012.340 L 773.275 1012.113 L 775.257 1011.872 L 777.235 1011.618 L 779.208 1011.349 L 781.176 1011.066 L 783.140 1010.769 L 785.099 1010.458 L 787.053 1010.134 L 789.003 1009.795 L 790.948 1009.443 L 792.888 1009.077 L 794.823 1008.698 L 796.753 1008.304 L 798.678 1007.898 L 800.598 1007.477 L 802.513 1007.044 L 804.423 1006.597 L 806.328 1006.136 L 808.228 1005.663 L 810.122 1005.176 L 812.011 1004.676 L 813.894 1004.163 L 815.772 1003.636 L 817.645 1003.097 L 819.512 1002.545 L 821.373 1001.979 L 823.229 1001.401 L 825.079 1000.810 L 826.923 1000.207 L 828.762 999.590 L 830.595 998.961 L 832.421 998.319 L 834.242 997.665 L 836.057 996.998 L 837.866 996.319 L 839.669 995.627 L 841.465 994.923 L 843.256 994.207 L 845.040 993.478 L 846.818 992.738 L 848.589 991.985 L 850.354 991.219 L 852.113 990.442 L 853.865 989.653 L 855.610 988.852 L 857.349 988.039 L 859.081 987.214 L 860.807 986.378 L 862.526 985.529 L 864.238 984.669 L 865.943 983.798 L 867.641 982.914 L 869.332 982.020 L 871.016 981.113 L 872.693 980.196 L 874.363 979.267 L 876.026 978.326 L 877.682 977.374 L 879.330 976.411 L 880.971 975.437 L 882.604 974.452 L 884.230 973.456 L 885.849 972.449 L 887.460 971.430 L 889.063 970.401 L 890.659 969.361 L 892.247 968.310 L 893.827 967.249 L 895.400 966.176 L 896.964 965.093 L 898.521 964.000 L 900.070 962.896 L 901.610 961.781 L 903.143 960.656 L 904.667 959.520 L 906.184 958.375 L 907.692 957.219 L 909.191 956.052 L 910.683 954.876 L 912.166 953.689 L 913.640 952.492 L 915.107 951.286 L 916.564 950.069 L 918.013 948.842 L 919.453 947.606 L 920.885 946.360 L 922.308 945.104 L 923.722 943.838 L 925.127 942.562 L 926.523 941.277 L 927.910 939.983 L 929.288 938.679 L 930.658 937.365 L 932.018 936.042 L 933.368 934.710 L 934.710 933.368 L 936.042 932.018 L 937.365 930.658 L 938.679 929.288 L 939.983 927.910 L 941.277 926.523 L 942.562 925.127 L 943.838 923.722 L 945.104 922.308 L 946.360 920.885 L 947.606 919.453 L 948.842 918.013 L 950.069 916.564 L 951.286 915.107 L 952.492 913.640 L 953.689 912.166 L 954.876 910.683 L 956.052 909.191 L 957.219 907.692 L 958.375 906.184 L 959.520 904.667 L 960.656 903.143 L 961.781 901.610 L 962.896 900.070 L 964.000 898.521 L 965.093 896.964 L 966.176 895.400 L 967.249 893.827 L 968.310 892.247 L 969.361 890.659 L 970.401 889.063 L 971.430 887.460 L 972.449 885.849 L 973.456 884.230 L 974.452 882.604 L 975.437 880.971 L 976.411 879.330 L 977.374 877.682 L 978.326 876.026 L 979.267 874.363 L 980.196 872.693 L 981.113 871.016 L 982.020 869.332 L 982.914 867.641 L 983.798 865.943 L 984.669 864.238 L 985.529 862.526 L 986.378 860.807 L 987.214 859.081 L 988.039 857.349 L 988.852 855.610 L 989.653 853.865 L 990.442 852.113 L 991.219 850.354 L 991.985 848.589 L 992.738 846.818 L 993.478 845.040 L 994.207 843.256 L 994.923 841.465 L 995.627 839.669 L 996.319 837.866 L 996.998 836.057 L 997.665 834.242 L 998.319 832.421 L 998.961 830.595 L 999.590 828.762 L 1000.207 826.923 L 1000.810 825.079 L 1001.401 823.229 L 1001.979 821.373 L 1002.545 819.512 L 1003.097 817.645 L 1003.636 815.772 L 1004.163 813.894 L 1004.676 812.011 L 1005.176 810.122 L 1005.663 808.228 L 1006.136 806.328 L 1006.597 804.423 L 1007.044 802.513 L 1007.477 800.598 L 1007.898 798.678 L 1008.304 796.753 L 1008.698 794.823 L 1009.077 792.888 L 1009.443 790.948 L 1009.795 789.003 L 1010.134 787.053 L 1010.458 785.099 L 1010.769 783.140 L 1011.066 781.176 L 1011.349 779.208 L 1011.618 777.235 L 1011.872 775.257 L 1012.113 773.275 L 1012.340 771.289 L 1012.552 769.299 L 1012.750 767.304 L 1012.933 765.304 L 1013.103 763.301 L 1013.258 761.294 L 1013.398 759.282 L 1013.524 757.266 L 1013.635 755.246 L 1013.731 753.223 L 1013.813 751.195 L 1013.880 749.164 L 1013.933 747.128 L 1013.970 745.089 L 1013.992 743.047 L 1014.000 740.982 L 1014.000 437.018 L 1013.992 434.953 L 1013.970 432.911 L 1013.933 430.872 L 1013.880 428.836 L 1013.813 426.805 L 1013.731 424.777 L 1013.635 422.754 L 1013.524 420.734 L 1013.398 418.718 L 1013.258 416.706 L 1013.103 414.699 L 1012.933 412.696 L 1012.750 410.696 L 1012.552 408.701 L 1012.340 406.711 L 1012.113 404.725 L 1011.872 402.743 L 1011.618 400.765 L 1011.349 398.792 L 1011.066 396.824 L 1010.769 394.860 L 1010.458 392.901 L 1010.134 390.947 L 1009.795 388.997 L 1009.443 387.052 L 1009.077 385.112 L 1008.698 383.177 L 1008.304 381.247 L 1007.898 379.322 L 1007.477 377.402 L 1007.044 375.487 L 1006.597 373.577 L 1006.136 371.672 L 1005.663 369.772 L 1005.176 367.878 L 1004.676 365.989 L 1004.163 364.106 L 1003.636 362.228 L 1003.097 360.355 L 1002.545 358.488 L 1001.979 356.627 L 1001.401 354.771 L 1000.810 352.921 L 1000.207 351.077 L 999.590 349.238 L 998.961 347.405 L 998.319 345.579 L 997.665 343.758 L 996.998 341.943 L 996.319 340.134 L 995.627 338.331 L 994.923 336.535 L 994.207 334.744 L 993.478 332.960 L 992.738 331.182 L 991.985 329.411 L 991.219 327.646 L 990.442 325.887 L 989.653 324.135 L 988.852 322.390 L 988.039 320.651 L 987.214 318.919 L 986.378 317.193 L 985.529 315.474 L 984.669 313.762 L 983.798 312.057 L 982.914 310.359 L 982.020 308.668 L 981.113 306.984 L 980.196 305.307 L 979.267 303.637 L 978.326 301.974 L 977.374 300.318 L 976.411 298.670 L 975.437 297.029 L 974.452 295.396 L 973.456 293.770 L 972.449 292.151 L 971.430 290.540 L 970.401 288.937 L 969.361 287.341 L 968.310 285.753 L 967.249 284.173 L 966.176 282.600 L 965.093 281.036 L 964.000 279.479 L 962.896 277.930 L 961.781 276.390 L 960.656 274.857 L 959.520 273.333 L 958.375 271.816 L 957.219 270.308 L 956.052 268.809 L 954.876 267.317 L 953.689 265.834 L 952.492 264.360 L 951.286 262.893 L 950.069 261.436 L 948.842 259.987 L 947.606 258.547 L 946.360 257.115 L 945.104 255.692 L 943.838 254.278 L 942.562 252.873 L 941.277 251.477 L 939.983 250.090 L 938.679 248.712 L 937.365 247.342 L 936.042 245.982 L 934.710 244.632 L 933.368 243.290 L 932.018 241.958 L 930.658 240.635 L 929.288 239.321 L 927.910 238.017 L 926.523 236.723 L 925.127 235.438 L 923.722 234.162 L 922.308 232.896 L 920.885 231.640 L 919.453 230.394 L 918.013 229.158 L 916.564 227.931 L 915.107 226.714 L 913.640 225.508 L 912.166 224.311 L 910.683 223.124 L 909.191 221.948 L 907.692 220.781 L 906.184 219.625 L 904.667 218.480 L 903.143 217.344 L 901.610 216.219 L 900.070 215.104 L 898.521 214.000 L 896.964 212.907 L 895.400 211.824 L 893.827 210.751 L 892.247 209.690 L 890.659 208.639 L 889.063 207.599 L 887.460 206.570 L 885.849 205.551 L 884.230 204.544 L 882.604 203.548 L 880.971 202.563 L 879.330 201.589 L 877.682 200.626 L 876.026 199.674 L 874.363 198.733 L 872.693 197.804 L 871.016 196.887 L 869.332 195.980 L 867.641 195.086 L 865.943 194.202 L 864.238 193.331 L 862.526 192.471 L 860.807 191.622 L 859.081 190.786 L 857.349 189.961 L 855.610 189.148 L 853.865 188.347 L 852.113 187.558 L 850.354 186.781 L 848.589 186.015 L 846.818 185.262 L 845.040 184.522 L 843.256 183.793 L 841.465 183.077 L 839.669 182.373 L 837.866 181.681 L 836.057 181.002 L 834.242 180.335 L 832.421 179.681 L 830.595 179.039 L 828.762 178.410 L 826.923 177.793 L 825.079 177.190 L 823.229 176.599 L 821.373 176.021 L 819.512 175.455 L 817.645 174.903 L 815.772 174.364 L 813.894 173.837 L 812.011 173.324 L 810.122 172.824 L 808.228 172.337 L 806.328 171.864 L 804.423 171.403 L 802.513 170.956 L 800.598 170.523 L 798.678 170.102 L 796.753 169.696 L 794.823 169.302 L 792.888 168.923 L 790.948 168.557 L 789.003 168.205 L 787.053 167.866 L 785.099 167.542 L 783.140 167.231 L 781.176 166.934 L 779.208 166.651 L 777.235 166.382 L 775.257 166.128 L 773.275 165.887 L 771.289 165.660 L 769.299 165.448 L 767.304 165.250 L 765.304 165.067 L 763.301 164.897 L 761.294 164.742 L 759.282 164.602 L 757.266 164.476 L 755.246 164.365 L 753.223 164.269 L 751.195 164.187 L 749.164 164.120 L 747.128 164.067 L 745.089 164.030 L 743.047 164.008 L 740.982 164.000 L 625.011 164.000 L 624.031 163.952 L 623.060 163.808 L 622.108 163.569 L 621.184 163.239 L 620.297 162.819 L 619.455 162.315 L 618.667 161.730 L 617.940 161.071 L 617.281 160.344 L 616.696 159.556 L 616.192 158.714 L 615.772 157.827 L 615.442 156.903 L 615.203 155.951 L 615.059 154.980 L 615.011 154.000 L 615.059 153.020 L 615.203 152.049 L 615.442 151.097 L 615.772 150.173 L 616.192 149.286 L 616.696 148.444 L 617.281 147.656 L 617.940 146.929 L 619.405 145.464 L 622.336 142.533 L 625.267 139.602 L 628.197 136.672 L 631.128 133.741 L 634.059 130.810 L 635.524 129.345 L 636.989 127.879 L 638.455 126.414 L 639.920 124.949 L 641.385 123.483 L 642.851 122.018 L 644.316 120.553 L 645.781 119.087 L 647.247 117.622 L 648.712 116.157 L 650.178 114.691 L 651.643 113.226 L 653.108 111.761 L 654.574 110.295 L 656.039 108.830 L 657.504 107.365 L 658.970 105.899 L 660.435 104.434 L 661.900 102.969 L 663.366 101.503 L 664.831 100.038 L 666.296 98.573 L 667.762 97.107 L 669.227 95.642 L 670.692 94.176 L 672.158 92.711 L 673.623 91.246 L 675.088 89.780 L 676.554 88.315 L 678.019 86.850 L 679.484 85.384 L 680.950 83.919 L 682.415 82.454 L 683.880 80.988 L 685.346 79.523 L 686.811 78.058 L 688.277 76.592 L 689.742 75.127 L 691.207 73.662 L 692.673 72.196 L 694.138 70.731 L 695.603 69.266 L 697.069 67.800 L 698.445 66.424 L 699.708 65.095 L 700.806 63.817 L 701.825 62.501 L 702.768 61.148 L 703.635 59.761 L 704.425 58.343 L 705.141 56.896 L 705.782 55.421 L 706.347 53.923 L 706.837 52.403 L 707.252 50.865 L 707.592 49.311 L 707.857 47.744 L 708.046 46.168 L 708.159 44.586 L 708.197 43.000 L 708.159 41.414 L 708.046 39.832 L 707.857 38.256 L 707.592 36.689 L 707.252 35.135 L 706.837 33.597 L 706.347 32.077 L 705.782 30.579 L 705.141 29.104 L 704.425 27.657 L 703.635 26.239 L 702.768 24.852 L 701.825 23.499 L 700.806 22.183 L 699.708 20.905 L 698.532 19.667 L 697.294 18.491 L 696.016 17.394 L 694.700 16.374 L 693.347 15.431 Z M 747.641 230.105 L 747.746 230.108 L 749.861 230.187 L 749.966 230.191 L 752.075 230.292 L 752.181 230.297 L 754.283 230.420 L 754.389 230.427 L 756.485 230.571 L 756.591 230.579 L 758.681 230.745 L 758.787 230.754 L 760.871 230.942 L 760.976 230.952 L 763.054 231.162 L 763.159 231.173 L 765.231 231.404 L 765.336 231.416 L 767.401 231.669 L 767.505 231.682 L 769.564 231.956 L 769.668 231.970 L 771.720 232.265 L 771.824 232.281 L 773.869 232.597 L 773.973 232.613 L 776.011 232.950 L 776.114 232.968 L 778.145 233.325 L 778.248 233.344 L 780.272 233.722 L 780.375 233.742 L 782.391 234.141 L 782.494 234.162 L 784.503 234.581 L 784.605 234.603 L 786.607 235.043 L 786.709 235.066 L 788.702 235.526 L 788.804 235.550 L 790.790 236.030 L 790.891 236.055 L 792.869 236.555 L 792.970 236.581 L 794.940 237.101 L 795.041 237.128 L 797.002 237.667 L 797.103 237.696 L 799.056 238.255 L 799.156 238.284 L 801.101 238.863 L 801.201 238.893 L 803.137 239.491 L 803.236 239.522 L 805.165 240.140 L 805.263 240.172 L 807.183 240.809 L 807.281 240.842 L 809.192 241.498 L 809.289 241.532 L 811.191 242.207 L 811.288 242.242 L 813.181 242.936 L 813.277 242.972 L 815.161 243.684 L 815.257 243.721 L 817.132 244.452 L 817.227 244.490 L 819.093 245.240 L 819.188 245.278 L 821.043 246.047 L 821.138 246.086 L 822.984 246.873 L 823.078 246.913 L 824.914 247.718 L 825.008 247.760 L 826.835 248.582 L 826.928 248.625 L 828.744 249.465 L 828.837 249.509 L 830.643 250.367 L 830.735 250.411 L 832.532 251.288 L 832.623 251.333 L 834.409 252.227 L 834.500 252.273 L 836.276 253.184 L 836.366 253.231 L 838.131 254.160 L 838.221 254.207 L 839.976 255.153 L 840.065 255.202 L 841.809 256.165 L 841.897 256.215 L 843.630 257.195 L 843.718 257.245 L 845.440 258.242 L 845.528 258.293 L 847.239 259.307 L 847.325 259.359 L 849.026 260.390 L 849.112 260.443 L 850.800 261.490 L 850.886 261.544 L 852.563 262.608 L 852.648 262.662 L 854.314 263.742 L 854.398 263.797 L 856.052 264.894 L 856.136 264.950 L 857.778 266.063 L 857.861 266.119 L 859.492 267.248 L 859.574 267.306 L 861.193 268.450 L 861.274 268.509 L 862.881 269.669 L 862.962 269.728 L 864.556 270.904 L 864.637 270.964 L 866.219 272.156 L 866.299 272.217 L 867.868 273.424 L 867.947 273.485 L 869.504 274.708 L 869.583 274.770 L 871.127 276.008 L 871.205 276.071 L 872.737 277.324 L 872.814 277.387 L 874.333 278.655 L 874.409 278.720 L 875.915 280.002 L 875.991 280.068 L 877.484 281.365 L 877.559 281.431 L 879.038 282.743 L 879.113 282.810 L 880.579 284.137 L 880.653 284.204 L 882.106 285.546 L 882.179 285.614 L 883.618 286.969 L 883.690 287.038 L 885.116 288.408 L 885.188 288.477 L 886.599 289.861 L 886.670 289.932 L 888.068 291.330 L 888.139 291.401 L 889.523 292.812 L 889.592 292.884 L 890.962 294.310 L 891.031 294.382 L 892.386 295.821 L 892.454 295.894 L 893.796 297.347 L 893.863 297.421 L 895.190 298.887 L 895.257 298.962 L 896.569 300.441 L 896.635 300.516 L 897.932 302.009 L 897.998 302.085 L 899.280 303.591 L 899.345 303.667 L 900.613 305.186 L 900.676 305.263 L 901.929 306.795 L 901.992 306.873 L 903.230 308.417 L 903.292 308.496 L 904.515 310.053 L 904.576 310.132 L 905.783 311.701 L 905.844 311.781 L 907.036 313.363 L 907.096 313.444 L 908.272 315.038 L 908.331 315.119 L 909.491 316.726 L 909.550 316.807 L 910.694 318.426 L 910.752 318.508 L 911.881 320.139 L 911.937 320.222 L 913.050 321.864 L 913.106 321.948 L 914.203 323.602 L 914.258 323.686 L 915.338 325.352 L 915.392 325.437 L 916.456 327.114 L 916.510 327.200 L 917.557 328.888 L 917.610 328.974 L 918.641 330.675 L 918.693 330.761 L 919.707 332.472 L 919.758 332.560 L 920.755 334.282 L 920.805 334.370 L 921.785 336.103 L 921.835 336.191 L 922.798 337.935 L 922.847 338.024 L 923.793 339.779 L 923.840 339.869 L 924.769 341.634 L 924.816 341.724 L 925.727 343.500 L 925.773 343.591 L 926.667 345.377 L 926.712 345.468 L 927.589 347.265 L 927.633 347.357 L 928.491 349.163 L 928.535 349.256 L 929.375 351.072 L 929.418 351.165 L 930.240 352.992 L 930.282 353.086 L 931.087 354.922 L 931.127 355.016 L 931.914 356.862 L 931.953 356.957 L 932.722 358.812 L 932.760 358.907 L 933.510 360.773 L 933.548 360.868 L 934.279 362.743 L 934.316 362.839 L 935.028 364.723 L 935.064 364.819 L 935.758 366.712 L 935.793 366.809 L 936.468 368.711 L 936.502 368.808 L 937.158 370.719 L 937.191 370.817 L 937.828 372.737 L 937.860 372.835 L 938.478 374.764 L 938.509 374.863 L 939.107 376.799 L 939.137 376.899 L 939.716 378.844 L 939.745 378.944 L 940.304 380.897 L 940.333 380.998 L 940.872 382.959 L 940.899 383.060 L 941.419 385.030 L 941.445 385.131 L 941.945 387.109 L 941.970 387.210 L 942.450 389.196 L 942.474 389.298 L 942.934 391.291 L 942.957 391.393 L 943.397 393.395 L 943.419 393.497 L 943.838 395.506 L 943.859 395.609 L 944.258 397.625 L 944.278 397.728 L 944.656 399.752 L 944.675 399.855 L 945.032 401.886 L 945.050 401.989 L 945.387 404.027 L 945.403 404.131 L 945.719 406.176 L 945.735 406.280 L 946.030 408.332 L 946.044 408.436 L 946.318 410.495 L 946.331 410.599 L 946.584 412.664 L 946.596 412.769 L 946.827 414.841 L 946.838 414.946 L 947.048 417.024 L 947.058 417.129 L 947.246 419.213 L 947.255 419.319 L 947.421 421.409 L 947.429 421.515 L 947.573 423.611 L 947.580 423.717 L 947.703 425.819 L 947.708 425.925 L 947.809 428.034 L 947.813 428.139 L 947.892 430.254 L 947.895 430.359 L 947.951 432.479 L 947.954 432.585 L 947.987 434.710 L 947.989 434.816 L 948.000 436.947 L 948.000 437.000 L 948.000 741.000 L 948.000 741.053 L 947.989 743.184 L 947.987 743.290 L 947.954 745.415 L 947.951 745.521 L 947.895 747.641 L 947.892 747.746 L 947.813 749.861 L 947.809 749.966 L 947.708 752.075 L 947.703 752.181 L 947.580 754.283 L 947.573 754.389 L 947.429 756.485 L 947.421 756.591 L 947.255 758.681 L 947.246 758.787 L 947.058 760.871 L 947.048 760.976 L 946.838 763.054 L 946.827 763.159 L 946.596 765.231 L 946.584 765.336 L 946.331 767.401 L 946.318 767.505 L 946.044 769.564 L 946.030 769.668 L 945.735 771.720 L 945.719 771.824 L 945.403 773.869 L 945.387 773.973 L 945.050 776.011 L 945.032 776.114 L 944.675 778.145 L 944.656 778.248 L 944.278 780.272 L 944.258 780.375 L 943.859 782.391 L 943.838 782.494 L 943.419 784.503 L 943.397 784.605 L 942.957 786.607 L 942.934 786.709 L 942.474 788.702 L 942.450 788.804 L 941.970 790.790 L 941.945 790.891 L 941.445 792.869 L 941.419 792.970 L 940.899 794.940 L 940.872 795.041 L 940.333 797.002 L 940.304 797.103 L 939.745 799.056 L 939.716 799.156 L 939.137 801.101 L 939.107 801.201 L 938.509 803.137 L 938.478 803.236 L 937.860 805.165 L 937.828 805.263 L 937.191 807.183 L 937.158 807.281 L 936.502 809.192 L 936.468 809.289 L 935.793 811.191 L 935.758 811.288 L 935.064 813.181 L 935.028 813.277 L 934.316 815.161 L 934.279 815.257 L 933.548 817.132 L 933.510 817.227 L 932.760 819.093 L 932.722 819.188 L 931.953 821.043 L 931.914 821.138 L 931.127 822.984 L 931.087 823.078 L 930.282 824.914 L 930.240 825.008 L 929.418 826.835 L 929.375 826.928 L 928.535 828.744 L 928.491 828.837 L 927.633 830.643 L 927.589 830.735 L 926.712 832.532 L 926.667 832.623 L 925.773 834.409 L 925.727 834.500 L 924.816 836.276 L 924.769 836.366 L 923.840 838.131 L 923.793 838.221 L 922.847 839.976 L 922.798 840.065 L 921.835 841.809 L 921.785 841.897 L 920.805 843.630 L 920.755 843.718 L 919.758 845.440 L 919.707 845.528 L 918.693 847.239 L 918.641 847.325 L 917.610 849.026 L 917.557 849.112 L 916.510 850.800 L 916.456 850.886 L 915.392 852.563 L 915.338 852.648 L 914.258 854.314 L 914.203 854.398 L 913.106 856.052 L 913.050 856.136 L 911.937 857.778 L 911.881 857.861 L 910.752 859.492 L 910.694 859.574 L 909.550 861.193 L 909.491 861.274 L 908.331 862.881 L 908.272 862.962 L 907.096 864.556 L 907.036 864.637 L 905.844 866.219 L 905.783 866.299 L 904.576 867.868 L 904.515 867.947 L 903.292 869.504 L 903.230 869.583 L 901.992 871.127 L 901.929 871.205 L 900.676 872.737 L 900.613 872.814 L 899.345 874.333 L 899.280 874.409 L 897.998 875.915 L 897.932 875.991 L 896.635 877.484 L 896.569 877.559 L 895.257 879.038 L 895.190 879.113 L 893.863 880.579 L 893.796 880.653 L 892.454 882.106 L 892.386 882.179 L 891.031 883.618 L 890.962 883.690 L 889.592 885.116 L 889.523 885.188 L 888.139 886.599 L 888.068 886.670 L 886.670 888.068 L 886.599 888.139 L 885.188 889.523 L 885.116 889.592 L 883.690 890.962 L 883.618 891.031 L 882.179 892.386 L 882.106 892.454 L 880.653 893.796 L 880.579 893.863 L 879.113 895.190 L 879.038 895.257 L 877.559 896.569 L 877.484 896.635 L 875.991 897.932 L 875.915 897.998 L 874.409 899.280 L 874.333 899.345 L 872.814 900.613 L 872.737 900.676 L 871.205 901.929 L 871.127 901.992 L 869.583 903.230 L 869.504 903.292 L 867.947 904.515 L 867.868 904.576 L 866.299 905.783 L 866.219 905.844 L 864.637 907.036 L 864.556 907.096 L 862.962 908.272 L 862.881 908.331 L 861.274 909.491 L 861.193 909.550 L 859.574 910.694 L 859.492 910.752 L 857.861 911.881 L 857.778 911.937 L 856.136 913.050 L 856.052 913.106 L 854.398 914.203 L 854.314 914.258 L 852.648 915.338 L 852.563 915.392 L 850.886 916.456 L 850.800 916.510 L 849.112 917.557 L 849.026 917.610 L 847.325 918.641 L 847.239 918.693 L 845.528 919.707 L 845.440 919.758 L 843.718 920.755 L 843.630 920.805 L 841.897 921.785 L 841.809 921.835 L 840.065 922.798 L 839.976 922.847 L 838.221 923.793 L 838.131 923.840 L 836.366 924.769 L 836.276 924.816 L 834.500 925.727 L 834.409 925.773 L 832.623 926.667 L 832.532 926.712 L 830.735 927.589 L 830.643 927.633 L 828.837 928.491 L 828.744 928.535 L 826.928 929.375 L 826.835 929.418 L 825.008 930.240 L 824.914 930.282 L 823.078 931.087 L 822.984 931.127 L 821.138 931.914 L 821.043 931.953 L 819.188 932.722 L 819.093 932.760 L 817.227 933.510 L 817.132 933.548 L 815.257 934.279 L 815.161 934.316 L 813.277 935.028 L 813.181 935.064 L 811.288 935.758 L 811.191 935.793 L 809.289 936.468 L 809.192 936.502 L 807.281 937.158 L 807.183 937.191 L 805.263 937.828 L 805.165 937.860 L 803.236 938.478 L 803.137 938.509 L 801.201 939.107 L 801.101 939.137 L 799.156 939.716 L 799.056 939.745 L 797.103 940.304 L 797.002 940.333 L 795.041 940.872 L 794.940 940.899 L 792.970 941.419 L 792.869 941.445 L 790.891 941.945 L 790.790 941.970 L 788.804 942.450 L 788.702 942.474 L 786.709 942.934 L 786.607 942.957 L 784.605 943.397 L 784.503 943.419 L 782.494 943.838 L 782.391 943.859 L 780.375 944.258 L 780.272 944.278 L 778.248 944.656 L 778.145 944.675 L 776.114 945.032 L 776.011 945.050 L 773.973 945.387 L 773.869 945.403 L 771.824 945.719 L 771.720 945.735 L 769.668 946.030 L 769.564 946.044 L 767.505 946.318 L 767.401 946.331 L 765.336 946.584 L 765.231 946.596 L 763.159 946.827 L 763.054 946.838 L 760.976 947.048 L 760.871 947.058 L 758.787 947.246 L 758.681 947.255 L 756.591 947.421 L 756.485 947.429 L 754.389 947.573 L 754.283 947.580 L 752.181 947.703 L 752.075 947.708 L 749.966 947.809 L 749.861 947.813 L 747.746 947.892 L 747.641 947.895 L 745.521 947.951 L 745.415 947.954 L 743.290 947.987 L 743.184 947.989 L 741.053 948.000 L 741.000 948.000 L 283.000 948.000 L 282.947 948.000 L 280.816 947.989 L 280.710 947.987 L 278.585 947.954 L 278.479 947.951 L 276.359 947.895 L 276.254 947.892 L 274.139 947.813 L 274.034 947.809 L 271.925 947.708 L 271.819 947.703 L 269.717 947.580 L 269.611 947.573 L 267.515 947.429 L 267.409 947.421 L 265.319 947.255 L 265.213 947.246 L 263.129 947.058 L 263.024 947.048 L 260.946 946.838 L 260.841 946.827 L 258.769 946.596 L 258.664 946.584 L 256.599 946.331 L 256.495 946.318 L 254.436 946.044 L 254.332 946.030 L 252.280 945.735 L 252.176 945.719 L 250.131 945.403 L 250.027 945.387 L 247.989 945.050 L 247.886 945.032 L 245.855 944.675 L 245.752 944.656 L 243.728 944.278 L 243.625 944.258 L 241.609 943.859 L 241.506 943.838 L 239.497 943.419 L 239.395 943.397 L 237.393 942.957 L 237.291 942.934 L 235.298 942.474 L 235.196 942.450 L 233.210 941.970 L 233.109 941.945 L 231.131 941.445 L 231.030 941.419 L 229.060 940.899 L 228.959 940.872 L 226.998 940.333 L 226.897 940.304 L 224.944 939.745 L 224.844 939.716 L 222.899 939.137 L 222.799 939.107 L 220.863 938.509 L 220.764 938.478 L 218.835 937.860 L 218.737 937.828 L 216.817 937.191 L 216.719 937.158 L 214.808 936.502 L 214.711 936.468 L 212.809 935.793 L 212.712 935.758 L 210.819 935.064 L 210.723 935.028 L 208.839 934.316 L 208.743 934.279 L 206.868 933.548 L 206.773 933.510 L 204.907 932.760 L 204.812 932.722 L 202.957 931.953 L 202.862 931.914 L 201.016 931.127 L 200.922 931.087 L 199.086 930.282 L 198.992 930.240 L 197.165 929.418 L 197.072 929.375 L 195.256 928.535 L 195.163 928.491 L 193.357 927.633 L 193.265 927.589 L 191.468 926.712 L 191.377 926.667 L 189.591 925.773 L 189.500 925.727 L 187.724 924.816 L 187.634 924.769 L 185.869 923.840 L 185.779 923.793 L 184.024 922.847 L 183.935 922.798 L 182.191 921.835 L 182.103 921.785 L 180.370 920.805 L 180.282 920.755 L 178.560 919.758 L 178.472 919.707 L 176.761 918.693 L 176.675 918.641 L 174.974 917.610 L 174.888 917.557 L 173.200 916.510 L 173.114 916.456 L 171.437 915.392 L 171.352 915.338 L 169.686 914.258 L 169.602 914.203 L 167.948 913.106 L 167.864 913.050 L 166.222 911.937 L 166.139 911.881 L 164.508 910.752 L 164.426 910.694 L 162.807 909.550 L 162.726 909.491 L 161.119 908.331 L 161.038 908.272 L 159.444 907.096 L 159.363 907.036 L 157.781 905.844 L 157.701 905.783 L 156.132 904.576 L 156.053 904.515 L 154.496 903.292 L 154.417 903.230 L 152.873 901.992 L 152.795 901.929 L 151.263 900.676 L 151.186 900.613 L 149.667 899.345 L 149.591 899.280 L 148.085 897.998 L 148.009 897.932 L 146.516 896.635 L 146.441 896.569 L 144.962 895.257 L 144.887 895.190 L 143.421 893.863 L 143.347 893.796 L 141.894 892.454 L 141.821 892.386 L 140.382 891.031 L 140.310 890.962 L 138.884 889.592 L 138.812 889.523 L 137.401 888.139 L 137.330 888.068 L 135.932 886.670 L 135.861 886.599 L 134.477 885.188 L 134.408 885.116 L 133.038 883.690 L 132.969 883.618 L 131.614 882.179 L 131.546 882.106 L 130.204 880.653 L 130.137 880.579 L 128.810 879.113 L 128.743 879.038 L 127.431 877.559 L 127.365 877.484 L 126.068 875.991 L 126.002 875.915 L 124.720 874.409 L 124.655 874.333 L 123.387 872.814 L 123.324 872.737 L 122.071 871.205 L 122.008 871.127 L 120.770 869.583 L 120.708 869.504 L 119.485 867.947 L 119.424 867.868 L 118.217 866.299 L 118.156 866.219 L 116.964 864.637 L 116.904 864.556 L 115.728 862.962 L 115.669 862.881 L 114.509 861.274 L 114.450 861.193 L 113.306 859.574 L 113.248 859.492 L 112.119 857.861 L 112.063 857.778 L 110.950 856.136 L 110.894 856.052 L 109.797 854.398 L 109.742 854.314 L 108.662 852.648 L 108.608 852.563 L 107.544 850.886 L 107.490 850.800 L 106.443 849.112 L 106.390 849.026 L 105.359 847.325 L 105.307 847.239 L 104.293 845.528 L 104.242 845.440 L 103.245 843.718 L 103.195 843.630 L 102.215 841.897 L 102.165 841.809 L 101.202 840.065 L 101.153 839.976 L 100.207 838.221 L 100.160 838.131 L 99.231 836.366 L 99.184 836.276 L 98.273 834.500 L 98.227 834.409 L 97.333 832.623 L 97.288 832.532 L 96.411 830.735 L 96.367 830.643 L 95.509 828.837 L 95.465 828.744 L 94.625 826.928 L 94.582 826.835 L 93.760 825.008 L 93.718 824.914 L 92.913 823.078 L 92.873 822.984 L 92.086 821.138 L 92.047 821.043 L 91.278 819.188 L 91.240 819.093 L 90.490 817.227 L 90.452 817.132 L 89.721 815.257 L 89.684 815.161 L 88.972 813.277 L 88.936 813.181 L 88.242 811.288 L 88.207 811.191 L 87.532 809.289 L 87.498 809.192 L 86.842 807.281 L 86.809 807.183 L 86.172 805.263 L 86.140 805.165 L 85.522 803.236 L 85.491 803.137 L 84.893 801.201 L 84.863 801.101 L 84.284 799.156 L 84.255 799.056 L 83.696 797.103 L 83.667 797.002 L 83.128 795.041 L 83.101 794.940 L 82.581 792.970 L 82.555 792.869 L 82.055 790.891 L 82.030 790.790 L 81.550 788.804 L 81.526 788.702 L 81.066 786.709 L 81.043 786.607 L 80.603 784.605 L 80.581 784.503 L 80.162 782.494 L 80.141 782.391 L 79.742 780.375 L 79.722 780.272 L 79.344 778.248 L 79.325 778.145 L 78.968 776.114 L 78.950 776.011 L 78.613 773.973 L 78.597 773.869 L 78.281 771.824 L 78.265 771.720 L 77.970 769.668 L 77.956 769.564 L 77.682 767.505 L 77.669 767.401 L 77.416 765.336 L 77.404 765.231 L 77.173 763.159 L 77.162 763.054 L 76.952 760.976 L 76.942 760.871 L 76.754 758.787 L 76.745 758.681 L 76.579 756.591 L 76.571 756.485 L 76.427 754.389 L 76.420 754.283 L 76.297 752.181 L 76.292 752.075 L 76.191 749.966 L 76.187 749.861 L 76.108 747.746 L 76.105 747.641 L 76.049 745.521 L 76.046 745.415 L 76.013 743.290 L 76.011 743.184 L 76.000 741.053 L 76.000 741.000 L 76.000 437.000 L 76.000 436.947 L 76.011 434.816 L 76.013 434.710 L 76.046 432.585 L 76.049 432.479 L 76.105 430.359 L 76.108 430.254 L 76.187 428.139 L 76.191 428.034 L 76.292 425.925 L 76.297 425.819 L 76.420 423.717 L 76.427 423.611 L 76.571 421.515 L 76.579 421.409 L 76.745 419.319 L 76.754 419.213 L 76.942 417.129 L 76.952 417.024 L 77.162 414.946 L 77.173 414.841 L 77.404 412.769 L 77.416 412.664 L 77.669 410.599 L 77.682 410.495 L 77.956 408.436 L 77.970 408.332 L 78.265 406.280 L 78.281 406.176 L 78.597 404.131 L 78.613 404.027 L 78.950 401.989 L 78.968 401.886 L 79.325 399.855 L 79.344 399.752 L 79.722 397.728 L 79.742 397.625 L 80.141 395.609 L 80.162 395.506 L 80.581 393.497 L 80.603 393.395 L 81.043 391.393 L 81.066 391.291 L 81.526 389.298 L 81.550 389.196 L 82.030 387.210 L 82.055 387.109 L 82.555 385.131 L 82.581 385.030 L 83.101 383.060 L 83.128 382.959 L 83.667 380.998 L 83.696 380.897 L 84.255 378.944 L 84.284 378.844 L 84.863 376.899 L 84.893 376.799 L 85.491 374.863 L 85.522 374.764 L 86.140 372.835 L 86.172 372.737 L 86.809 370.817 L 86.842 370.719 L 87.498 368.808 L 87.532 368.711 L 88.207 366.809 L 88.242 366.712 L 88.936 364.819 L 88.972 364.723 L 89.684 362.839 L 89.721 362.743 L 90.452 360.868 L 90.490 360.773 L 91.240 358.907 L 91.278 358.812 L 92.047 356.957 L 92.086 356.862 L 92.873 355.016 L 92.913 354.922 L 93.718 353.086 L 93.760 352.992 L 94.582 351.165 L 94.625 351.072 L 95.465 349.256 L 95.509 349.163 L 96.367 347.357 L 96.411 347.265 L 97.288 345.468 L 97.333 345.377 L 98.227 343.591 L 98.273 343.500 L 99.184 341.724 L 99.231 341.634 L 100.160 339.869 L 100.207 339.779 L 101.153 338.024 L 101.202 337.935 L 102.165 336.191 L 102.215 336.103 L 103.195 334.370 L 103.245 334.282 L 104.242 332.560 L 104.293 332.472 L 105.307 330.761 L 105.359 330.675 L 106.390 328.974 L 106.443 328.888 L 107.490 327.200 L 107.544 327.114 L 108.608 325.437 L 108.662 325.352 L 109.742 323.686 L 109.797 323.602 L 110.894 321.948 L 110.950 321.864 L 112.063 320.222 L 112.119 320.139 L 113.248 318.508 L 113.306 318.426 L 114.450 316.807 L 114.509 316.726 L 115.669 315.119 L 115.728 315.038 L 116.904 313.444 L 116.964 313.363 L 118.156 311.781 L 118.217 311.701 L 119.424 310.132 L 119.485 310.053 L 120.708 308.496 L 120.770 308.417 L 122.008 306.873 L 122.071 306.795 L 123.324 305.263 L 123.387 305.186 L 124.655 303.667 L 124.720 303.591 L 126.002 302.085 L 126.068 302.009 L 127.365 300.516 L 127.431 300.441 L 128.743 298.962 L 128.810 298.887 L 130.137 297.421 L 130.204 297.347 L 131.546 295.894 L 131.614 295.821 L 132.969 294.382 L 133.038 294.310 L 134.408 292.884 L 134.477 292.812 L 135.861 291.401 L 135.932 291.330 L 137.330 289.932 L 137.401 289.861 L 138.812 288.477 L 138.884 288.408 L 140.310 287.038 L 140.382 286.969 L 141.821 285.614 L 141.894 285.546 L 143.347 284.204 L 143.421 284.137 L 144.887 282.810 L 144.962 282.743 L 146.441 281.431 L 146.516 281.365 L 148.009 280.068 L 148.085 280.002 L 149.591 278.720 L 149.667 278.655 L 151.186 277.387 L 151.263 277.324 L 152.795 276.071 L 152.873 276.008 L 154.417 274.770 L 154.496 274.708 L 156.053 273.485 L 156.132 273.424 L 157.701 272.217 L 157.781 272.156 L 159.363 270.964 L 159.444 270.904 L 161.038 269.728 L 161.119 269.669 L 162.726 268.509 L 162.807 268.450 L 164.426 267.306 L 164.508 267.248 L 166.139 266.119 L 166.222 266.063 L 167.864 264.950 L 167.948 264.894 L 169.602 263.797 L 169.686 263.742 L 171.352 262.662 L 171.437 262.608 L 173.114 261.544 L 173.200 261.490 L 174.888 260.443 L 174.974 260.390 L 176.675 259.359 L 176.761 259.307 L 178.472 258.293 L 178.560 258.242 L 180.282 257.245 L 180.370 257.195 L 182.103 256.215 L 182.191 256.165 L 183.935 255.202 L 184.024 255.153 L 185.779 254.207 L 185.869 254.160 L 187.634 253.231 L 187.724 253.184 L 189.500 252.273 L 189.591 252.227 L 191.377 251.333 L 191.468 251.288 L 193.265 250.411 L 193.357 250.367 L 195.163 249.509 L 195.256 249.465 L 197.072 248.625 L 197.165 248.582 L 198.992 247.760 L 199.086 247.718 L 200.922 246.913 L 201.016 246.873 L 202.862 246.086 L 202.957 246.047 L 204.812 245.278 L 204.907 245.240 L 206.773 244.490 L 206.868 244.452 L 208.743 243.721 L 208.839 243.684 L 210.723 242.972 L 210.819 242.936 L 212.712 242.242 L 212.809 242.207 L 214.711 241.532 L 214.808 241.498 L 216.719 240.842 L 216.817 240.809 L 218.737 240.172 L 218.835 240.140 L 220.764 239.522 L 220.863 239.491 L 222.799 238.893 L 222.899 238.863 L 224.844 238.284 L 224.944 238.255 L 226.897 237.696 L 226.998 237.667 L 228.959 237.128 L 229.060 237.101 L 231.030 236.581 L 231.131 236.555 L 233.109 236.055 L 233.210 236.030 L 235.196 235.550 L 235.298 235.526 L 237.291 235.066 L 237.393 235.043 L 239.395 234.603 L 239.497 234.581 L 241.506 234.162 L 241.609 234.141 L 243.625 233.742 L 243.728 233.722 L 245.752 233.344 L 245.855 233.325 L 247.886 232.968 L 247.989 232.950 L 250.027 232.613 L 250.131 232.597 L 252.176 232.281 L 252.280 232.265 L 254.332 231.970 L 254.436 231.956 L 256.495 231.682 L 256.599 231.669 L 258.664 231.416 L 258.769 231.404 L 260.841 231.173 L 260.946 231.162 L 263.024 230.952 L 263.129 230.942 L 265.213 230.754 L 265.319 230.745 L 267.409 230.579 L 267.515 230.571 L 269.611 230.427 L 269.717 230.420 L 271.819 230.297 L 271.925 230.292 L 274.034 230.191 L 274.139 230.187 L 276.254 230.108 L 276.359 230.105 L 278.479 230.049 L 278.585 230.046 L 280.710 230.013 L 280.816 230.011 L 282.947 230.000 L 283.000 230.000 L 741.000 230.000 L 741.053 230.000 L 743.184 230.011 L 743.290 230.013 L 745.415 230.046 L 745.521 230.049 L 747.641 230.105 Z M 688.000 528.002 L 686.194 528.035 L 684.407 528.134 L 682.640 528.297 L 680.894 528.523 L 679.170 528.810 L 677.467 529.159 L 675.788 529.566 L 674.132 530.032 L 672.502 530.556 L 670.897 531.135 L 669.319 531.770 L 667.769 532.458 L 666.248 533.199 L 664.758 533.992 L 663.298 534.835 L 661.871 535.728 L 660.478 536.670 L 659.119 537.658 L 657.797 538.693 L 656.512 539.772 L 655.266 540.895 L 654.060 542.060 L 652.895 543.266 L 651.772 544.512 L 650.693 545.797 L 649.658 547.119 L 648.670 548.478 L 647.728 549.871 L 646.835 551.298 L 645.992 552.758 L 645.199 554.248 L 644.458 555.769 L 643.770 557.319 L 643.135 558.897 L 642.556 560.502 L 642.032 562.132 L 641.566 563.788 L 641.159 565.467 L 640.810 567.170 L 640.523 568.894 L 640.297 570.640 L 640.134 572.407 L 640.035 574.194 L 640.002 576.000 L 640.035 577.806 L 640.134 579.593 L 640.297 581.360 L 640.523 583.106 L 640.810 584.830 L 641.159 586.533 L 641.566 588.212 L 642.032 589.868 L 642.556 591.498 L 643.135 593.103 L 643.770 594.681 L 644.458 596.231 L 645.199 597.752 L 645.992 599.242 L 646.835 600.702 L 647.728 602.129 L 648.670 603.522 L 649.658 604.881 L 650.693 606.203 L 651.772 607.488 L 652.895 608.734 L 654.060 609.940 L 655.266 611.105 L 656.512 612.228 L 657.797 613.307 L 659.119 614.342 L 660.478 615.330 L 661.871 616.272 L 663.298 617.165 L 664.758 618.008 L 666.248 618.801 L 667.769 619.542 L 669.319 620.230 L 670.897 620.865 L 672.502 621.444 L 674.132 621.968 L 675.788 622.434 L 677.467 622.841 L 679.170 623.190 L 680.894 623.477 L 682.640 623.703 L 684.407 623.866 L 686.194 623.965 L 688.000 623.998 L 689.806 623.965 L 691.593 623.866 L 693.360 623.703 L 695.106 623.477 L 696.830 623.190 L 698.533 622.841 L 700.212 622.434 L 701.868 621.968 L 703.498 621.444 L 705.103 620.865 L 706.681 620.230 L 708.231 619.542 L 709.752 618.801 L 711.242 618.008 L 712.702 617.165 L 714.129 616.272 L 715.522 615.330 L 716.881 614.342 L 718.203 613.307 L 719.488 612.228 L 720.734 611.105 L 721.940 609.940 L 723.105 608.734 L 724.228 607.488 L 725.307 606.203 L 726.342 604.881 L 727.330 603.522 L 728.272 602.129 L 729.165 600.702 L 730.008 599.242 L 730.801 597.752 L 731.542 596.231 L 732.230 594.681 L 732.865 593.103 L 733.444 591.498 L 733.968 589.868 L 734.434 588.212 L 734.841 586.533 L 735.190 584.830 L 735.477 583.106 L 735.703 581.360 L 735.866 579.593 L 735.965 577.806 L 735.998 576.000 L 735.965 574.194 L 735.866 572.407 L 735.703 570.640 L 735.477 568.894 L 735.190 567.170 L 734.841 565.467 L 734.434 563.788 L 733.968 562.132 L 733.444 560.502 L 732.865 558.897 L 732.230 557.319 L 731.542 555.769 L 730.801 554.248 L 730.008 552.758 L 729.165 551.298 L 728.272 549.871 L 727.330 548.478 L 726.342 547.119 L 725.307 545.797 L 724.228 544.512 L 723.105 543.266 L 721.940 542.060 L 720.734 540.895 L 719.488 539.772 L 718.203 538.693 L 716.881 537.658 L 715.522 536.670 L 714.129 535.728 L 712.702 534.835 L 711.242 533.992 L 709.752 533.199 L 708.231 532.458 L 706.681 531.770 L 705.103 531.135 L 703.498 530.556 L 701.868 530.032 L 700.212 529.566 L 698.533 529.159 L 696.830 528.810 L 695.106 528.523 L 693.360 528.297 L 691.593 528.134 L 689.806 528.035 L 688.000 528.002 Z M 510.194 528.035 L 508.407 528.134 L 506.640 528.297 L 504.894 528.523 L 503.170 528.810 L 501.467 529.159 L 499.788 529.566 L 498.132 530.032 L 496.502 530.556 L 494.897 531.135 L 493.319 531.770 L 491.769 532.458 L 490.248 533.199 L 488.758 533.992 L 487.298 534.835 L 485.871 535.728 L 484.478 536.670 L 483.119 537.658 L 481.797 538.693 L 480.512 539.772 L 479.266 540.895 L 478.060 542.060 L 476.895 543.266 L 475.772 544.512 L 474.693 545.797 L 473.658 547.119 L 472.670 548.478 L 471.728 549.871 L 470.835 551.298 L 469.992 552.758 L 469.199 554.248 L 468.458 555.769 L 467.770 557.319 L 467.135 558.897 L 466.556 560.502 L 466.032 562.132 L 465.566 563.788 L 465.159 565.467 L 464.810 567.170 L 464.523 568.894 L 464.297 570.640 L 464.134 572.407 L 464.035 574.194 L 464.002 576.000 L 464.035 577.806 L 464.134 579.593 L 464.297 581.360 L 464.523 583.106 L 464.810 584.830 L 465.159 586.533 L 465.566 588.212 L 466.032 589.868 L 466.556 591.498 L 467.135 593.103 L 467.770 594.681 L 468.458 596.231 L 469.199 597.752 L 469.992 599.242 L 470.835 600.702 L 471.728 602.129 L 472.670 603.522 L 473.658 604.881 L 474.693 606.203 L 475.772 607.488 L 476.895 608.734 L 478.060 609.940 L 479.266 611.105 L 480.512 612.228 L 481.797 613.307 L 483.119 614.342 L 484.478 615.330 L 485.871 616.272 L 487.298 617.165 L 488.758 618.008 L 490.248 618.801 L 491.769 619.542 L 493.319 620.230 L 494.897 620.865 L 496.502 621.444 L 498.132 621.968 L 499.788 622.434 L 501.467 622.841 L 503.170 623.190 L 504.894 623.477 L 506.640 623.703 L 508.407 623.866 L 510.194 623.965 L 512.000 623.998 L 513.806 623.965 L 515.593 623.866 L 517.360 623.703 L 519.106 623.477 L 520.830 623.190 L 522.533 622.841 L 524.212 622.434 L 525.868 621.968 L 527.498 621.444 L 529.103 620.865 L 530.681 620.230 L 532.231 619.542 L 533.752 618.801 L 535.242 618.008 L 536.702 617.165 L 538.129 616.272 L 539.522 615.330 L 540.881 614.342 L 542.203 613.307 L 543.488 612.228 L 544.734 611.105 L 545.940 609.940 L 547.105 608.734 L 548.228 607.488 L 549.307 606.203 L 550.342 604.881 L 551.330 603.522 L 552.272 602.129 L 553.165 600.702 L 554.008 599.242 L 554.801 597.752 L 555.542 596.231 L 556.230 594.681 L 556.865 593.103 L 557.444 591.498 L 557.968 589.868 L 558.434 588.212 L 558.841 586.533 L 559.190 584.830 L 559.477 583.106 L 559.703 581.360 L 559.866 579.593 L 559.965 577.806 L 559.998 576.000 L 559.965 574.194 L 559.866 572.407 L 559.703 570.640 L 559.477 568.894 L 559.190 567.170 L 558.841 565.467 L 558.434 563.788 L 557.968 562.132 L 557.444 560.502 L 556.865 558.897 L 556.230 557.319 L 555.542 555.769 L 554.801 554.248 L 554.008 552.758 L 553.165 551.298 L 552.272 549.871 L 551.330 548.478 L 550.342 547.119 L 549.307 545.797 L 548.228 544.512 L 547.105 543.266 L 545.940 542.060 L 544.734 540.895 L 543.488 539.772 L 542.203 538.693 L 540.881 537.658 L 539.522 536.670 L 538.129 535.728 L 536.702 534.835 L 535.242 533.992 L 533.752 533.199 L 532.231 532.458 L 530.681 531.770 L 529.103 531.135 L 527.498 530.556 L 525.868 530.032 L 524.212 529.566 L 522.533 529.159 L 520.830 528.810 L 519.106 528.523 L 517.360 528.297 L 515.593 528.134 L 513.806 528.035 L 512.000 528.002 L 510.194 528.035 Z M 332.407 528.134 L 330.640 528.297 L 328.894 528.523 L 327.170 528.810 L 325.467 529.159 L 323.788 529.566 L 322.132 530.032 L 320.502 530.556 L 318.897 531.135 L 317.319 531.770 L 315.769 532.458 L 314.248 533.199 L 312.758 533.992 L 311.298 534.835 L 309.871 535.728 L 308.478 536.670 L 307.119 537.658 L 305.797 538.693 L 304.512 539.772 L 303.266 540.895 L 302.060 542.060 L 300.895 543.266 L 299.772 544.512 L 298.693 545.797 L 297.658 547.119 L 296.670 548.478 L 295.728 549.871 L 294.835 551.298 L 293.992 552.758 L 293.199 554.248 L 292.458 555.769 L 291.770 557.319 L 291.135 558.897 L 290.556 560.502 L 290.032 562.132 L 289.566 563.788 L 289.159 565.467 L 288.810 567.170 L 288.523 568.894 L 288.297 570.640 L 288.134 572.407 L 288.035 574.194 L 288.002 576.000 L 288.035 577.806 L 288.134 579.593 L 288.297 581.360 L 288.523 583.106 L 288.810 584.830 L 289.159 586.533 L 289.566 588.212 L 290.032 589.868 L 290.556 591.498 L 291.135 593.103 L 291.770 594.681 L 292.458 596.231 L 293.199 597.752 L 293.992 599.242 L 294.835 600.702 L 295.728 602.129 L 296.670 603.522 L 297.658 604.881 L 298.693 606.203 L 299.772 607.488 L 300.895 608.734 L 302.060 609.940 L 303.266 611.105 L 304.512 612.228 L 305.797 613.307 L 307.119 614.342 L 308.478 615.330 L 309.871 616.272 L 311.298 617.165 L 312.758 618.008 L 314.248 618.801 L 315.769 619.542 L 317.319 620.230 L 318.897 620.865 L 320.502 621.444 L 322.132 621.968 L 323.788 622.434 L 325.467 622.841 L 327.170 623.190 L 328.894 623.477 L 330.640 623.703 L 332.407 623.866 L 334.194 623.965 L 336.000 623.998 L 337.806 623.965 L 339.593 623.866 L 341.360 623.703 L 343.106 623.477 L 344.830 623.190 L 346.533 622.841 L 348.212 622.434 L 349.868 621.968 L 351.498 621.444 L 353.103 620.865 L 354.681 620.230 L 356.231 619.542 L 357.752 618.801 L 359.242 618.008 L 360.702 617.165 L 362.129 616.272 L 363.522 615.330 L 364.881 614.342 L 366.203 613.307 L 367.488 612.228 L 368.734 611.105 L 369.940 609.940 L 371.105 608.734 L 372.228 607.488 L 373.307 606.203 L 374.342 604.881 L 375.330 603.522 L 376.272 602.129 L 377.165 600.702 L 378.008 599.242 L 378.801 597.752 L 379.542 596.231 L 380.230 594.681 L 380.865 593.103 L 381.444 591.498 L 381.968 589.868 L 382.434 588.212 L 382.841 586.533 L 383.190 584.830 L 383.477 583.106 L 383.703 581.360 L 383.866 579.593 L 383.965 577.806 L 383.998 576.000 L 383.965 574.194 L 383.866 572.407 L 383.703 570.640 L 383.477 568.894 L 383.190 567.170 L 382.841 565.467 L 382.434 563.788 L 381.968 562.132 L 381.444 560.502 L 380.865 558.897 L 380.230 557.319 L 379.542 555.769 L 378.801 554.248 L 378.008 552.758 L 377.165 551.298 L 376.272 549.871 L 375.330 548.478 L 374.342 547.119 L 373.307 545.797 L 372.228 544.512 L 371.105 543.266 L 369.940 542.060 L 368.734 540.895 L 367.488 539.772 L 366.203 538.693 L 364.881 537.658 L 363.522 536.670 L 362.129 535.728 L 360.702 534.835 L 359.242 533.992 L 357.752 533.199 L 356.231 532.458 L 354.681 531.770 L 353.103 531.135 L 351.498 530.556 L 349.868 530.032 L 348.212 529.566 L 346.533 529.159 L 344.830 528.810 L 343.106 528.523 L 341.360 528.297 L 339.593 528.134 L 337.806 528.035 L 336.000 528.002 L 334.194 528.035 L 332.407 528.134 Z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
    const OnlineIcon = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$5]]);
    const _sfc_main$d = {};
    const _hoisted_1$d = {
      class: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16"
    };
    function _sfc_render$4(_ctx, _cache) {
      return openBlock(), createElementBlock("svg", _hoisted_1$d, _cache[0] || (_cache[0] = [
        createBaseVNode("path", {
          d: "M513.728 64a238.912 238.912 0 1 1 0 477.888 238.912 238.912 0 0 1 0-477.888z m0 64a174.912 174.912 0 1 0 0 349.888 174.912 174.912 0 0 0 0-349.888z m0.896 473.6c113.536 0 226.816 26.944 339.904 80.896a127.808 127.808 0 0 1 73.088 115.328V896a64 64 0 0 1-64 64h-704a64 64 0 0 1-64-64v-97.28c0-49.6 28.8-94.72 73.792-115.648C285.632 628.736 400.64 601.6 514.56 601.6z m0 64c-104.256 0-210.112 24.96-318.144 75.456a63.872 63.872 0 0 0-36.864 57.728V896h704v-98.112a63.872 63.872 0 0 0-36.608-57.6c-104.704-49.92-208.64-74.688-312.32-74.688z",
          fill: "currentColor"
        }, null, -1)
      ]));
    }
    const UserIcon = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$4]]);
    const storageHelper = {
      // 保存token到双重存储
      setToken(token2) {
        try {
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("auth_token", token2);
          }
        } catch (err) {
          console.warn("GM_setValue失败，使用localStorage:", err);
        }
        try {
          localStorage.setItem("auth_token", token2);
        } catch (err) {
          console.error("localStorage保存失败:", err);
        }
      },
      // 从双重存储读取token
      getToken() {
        let token2 = null;
        try {
          if (typeof GM_getValue !== "undefined") {
            token2 = GM_getValue("auth_token", null);
            if (token2) {
              return token2;
            }
          }
        } catch (err) {
          console.warn("GM_getValue失败，尝试localStorage:", err);
        }
        try {
          token2 = localStorage.getItem("auth_token");
          return token2;
        } catch (err) {
          console.error("localStorage读取失败:", err);
          return null;
        }
      },
      // 从双重存储删除token
      removeToken() {
        try {
          if (typeof GM_deleteValue !== "undefined") {
            GM_deleteValue("auth_token");
          }
        } catch (err) {
          console.warn("GM_deleteValue失败:", err);
        }
        try {
          localStorage.removeItem("auth_token");
        } catch (err) {
          console.error("localStorage删除失败:", err);
        }
      },
      // 保存用户信息到双重存储
      setUser(user2) {
        const userStr = JSON.stringify(user2);
        try {
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("user_info", userStr);
          }
        } catch (err) {
          console.warn("GM_setValue保存用户信息失败，使用localStorage:", err);
        }
        try {
          localStorage.setItem("user_info", userStr);
        } catch (err) {
          console.error("localStorage保存用户信息失败:", err);
        }
      },
      // 从双重存储读取用户信息
      getUser() {
        let userStr = null;
        try {
          if (typeof GM_getValue !== "undefined") {
            userStr = GM_getValue("user_info", null);
            if (userStr) {
              return JSON.parse(userStr);
            }
          }
        } catch (err) {
          console.warn("GM_getValue读取用户信息失败，尝试localStorage:", err);
        }
        try {
          userStr = localStorage.getItem("user_info");
          return userStr ? JSON.parse(userStr) : null;
        } catch (err) {
          console.error("localStorage读取用户信息失败:", err);
          return null;
        }
      },
      // 从双重存储删除用户信息
      removeUser() {
        try {
          if (typeof GM_deleteValue !== "undefined") {
            GM_deleteValue("user_info");
          }
        } catch (err) {
          console.warn("GM_deleteValue删除用户信息失败:", err);
        }
        try {
          localStorage.removeItem("user_info");
        } catch (err) {
          console.error("localStorage删除用户信息失败:", err);
        }
      },
      // 排序偏好存储方法
      setSortPreference(sortType) {
        try {
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("link_sort_preference", sortType);
          }
        } catch (err) {
          console.warn("GM_setValue失败，使用localStorage:", err);
        }
        try {
          localStorage.setItem("link_sort_preference", sortType);
        } catch (err) {
          console.error("localStorage保存排序偏好失败:", err);
        }
      },
      getSortPreference() {
        let sortType = null;
        try {
          if (typeof GM_getValue !== "undefined") {
            sortType = GM_getValue("link_sort_preference", null);
            if (sortType) return sortType;
          }
        } catch (err) {
          console.warn("GM_getValue失败，尝试localStorage:", err);
        }
        try {
          sortType = localStorage.getItem("link_sort_preference");
          return sortType || "likes";
        } catch (err) {
          console.error("localStorage读取排序偏好失败:", err);
          return "likes";
        }
      },
      // 平台筛选偏好存储方法
      setPlatformPreference(platform) {
        try {
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("link_platform_preference", platform);
          }
        } catch (err) {
          console.warn("GM_setValue失败，使用localStorage:", err);
        }
        try {
          localStorage.setItem("link_platform_preference", platform);
        } catch (err) {
          console.error("localStorage保存平台偏好失败:", err);
        }
      },
      getPlatformPreference() {
        let platform = null;
        try {
          if (typeof GM_getValue !== "undefined") {
            platform = GM_getValue("link_platform_preference", null);
            if (platform) return platform;
          }
        } catch (err) {
          console.warn("GM_getValue失败，尝试localStorage:", err);
        }
        try {
          platform = localStorage.getItem("link_platform_preference");
          return platform || "";
        } catch (err) {
          console.error("localStorage读取平台偏好失败:", err);
          return "";
        }
      },
      // API状态存储方法
      setApiState(state) {
        try {
          const stateData = JSON.stringify(state);
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("api_state", stateData);
          } else {
            localStorage.setItem("doubanflix_api_state", stateData);
          }
        } catch (error2) {
          console.warn("保存API状态失败:", error2);
          try {
            localStorage.setItem("doubanflix_api_state", JSON.stringify(state));
          } catch (fallbackError) {
            console.error("localStorage保存API状态也失败:", fallbackError);
          }
        }
      },
      // 获取API状态
      getApiState() {
        try {
          let stateData = null;
          if (typeof GM_getValue !== "undefined") {
            stateData = GM_getValue("api_state", null);
          } else {
            stateData = localStorage.getItem("doubanflix_api_state");
          }
          return stateData ? JSON.parse(stateData) : null;
        } catch (error2) {
          console.warn("获取API状态失败:", error2);
          try {
            const stateData = localStorage.getItem("doubanflix_api_state");
            return stateData ? JSON.parse(stateData) : null;
          } catch (fallbackError) {
            console.error("localStorage获取API状态也失败:", fallbackError);
            return null;
          }
        }
      },
      // 清除API状态
      removeApiState() {
        try {
          if (typeof GM_deleteValue !== "undefined") {
            GM_deleteValue("api_state");
          } else {
            localStorage.removeItem("doubanflix_api_state");
          }
        } catch (error2) {
          console.warn("清除API状态失败:", error2);
          try {
            localStorage.removeItem("doubanflix_api_state");
          } catch (fallbackError) {
            console.error("localStorage清除API状态也失败:", fallbackError);
          }
        }
      }
    };
    const PRIMARY_API_BASE_URL = "https://das.doubanflix.com/api";
    const FALLBACK_API_BASE_URL = "https://api.doubanflix.com/api";
    const REQUEST_TIMEOUT = 1e4;
    const FALLBACK_RETRY_DELAY = 1e3;
    const AUTO_RESET_DELAY = 2 * 60 * 60 * 1e3;
    class ApiClient {
      constructor() {
        this.primaryURL = PRIMARY_API_BASE_URL;
        this.fallbackURL = FALLBACK_API_BASE_URL;
        this.timeout = REQUEST_TIMEOUT;
        this.resetTimer = null;
        this.initializeFromStorage();
      }
      // 从本地存储初始化API状态
      initializeFromStorage() {
        const savedState = storageHelper.getApiState();
        if (savedState) {
          this.isUsingFallback = savedState.isUsingFallback || false;
          this.currentURL = this.isUsingFallback ? this.fallbackURL : this.primaryURL;
          if (this.isUsingFallback && savedState.switchTime) {
            const switchTime = new Date(savedState.switchTime).getTime();
            const currentTime = Date.now();
            const elapsedTime = currentTime - switchTime;
            if (elapsedTime < AUTO_RESET_DELAY) {
              const remainingTime = AUTO_RESET_DELAY - elapsedTime;
              console.log(`从本地存储恢复API状态，继续使用备用接口，剩余 ${Math.round(remainingTime / 1e3 / 60)} 分钟后自动切换回主接口`);
              this.resetTimer = setTimeout(() => {
                console.log("定时器触发，自动切换回主接口");
                this.forceResetToPrimary();
              }, remainingTime);
            } else {
              console.log("切换时间已过，自动重置到主接口");
              this.forceResetToPrimary();
            }
          }
        } else {
          this.currentURL = this.primaryURL;
          this.isUsingFallback = false;
        }
      }
      // 保存API状态到本地存储
      saveApiState() {
        const state = {
          isUsingFallback: this.isUsingFallback,
          switchTime: this.isUsingFallback ? (/* @__PURE__ */ new Date()).toISOString() : null
        };
        storageHelper.setApiState(state);
      }
      // 切换到备用接口
      switchToFallback() {
        if (!this.isUsingFallback) {
          console.warn("主要API接口无法访问，切换到备用接口:", this.fallbackURL);
          this.currentURL = this.fallbackURL;
          this.isUsingFallback = true;
          this.saveApiState();
          this.startAutoResetTimer();
        }
      }
      // 重置到主要接口
      resetToPrimary() {
        if (this.isUsingFallback) {
          console.log("重置到主要API接口:", this.primaryURL);
          this.currentURL = this.primaryURL;
          this.isUsingFallback = false;
          storageHelper.removeApiState();
          this.clearAutoResetTimer();
        }
      }
      // 启动自动重置定时器
      startAutoResetTimer() {
        this.clearAutoResetTimer();
        console.log(`将在 ${AUTO_RESET_DELAY / 1e3 / 60} 分钟后自动尝试切换回主接口`);
        this.resetTimer = setTimeout(() => {
          console.log("定时器触发，自动切换回主接口");
          this.forceResetToPrimary();
        }, AUTO_RESET_DELAY);
      }
      // 清除自动重置定时器
      clearAutoResetTimer() {
        if (this.resetTimer) {
          clearTimeout(this.resetTimer);
          this.resetTimer = null;
        }
      }
      // 强制重置到主接口（无论当前状态）
      forceResetToPrimary() {
        console.log("强制重置到主要API接口:", this.primaryURL);
        this.currentURL = this.primaryURL;
        this.isUsingFallback = false;
        storageHelper.removeApiState();
        this.clearAutoResetTimer();
      }
      // 检查是否为网络连接错误
      isNetworkError(error2) {
        return error2.name === "AbortError" || error2.name === "TypeError" || error2.message.includes("Failed to fetch") || error2.message.includes("Network request failed") || error2.message.includes("请求超时");
      }
      // 请求拦截器 - 添加认证头
      addAuthHeaders(headers = {}) {
        const token2 = storageHelper.getToken();
        if (token2) {
          headers.Authorization = `Bearer ${token2}`;
        }
        return {
          "Content-Type": "application/json",
          ...headers
        };
      }
      // 响应处理
      async handleResponse(response) {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          switch (response.status) {
            case 401:
              const existingToken = storageHelper.getToken();
              if (existingToken) {
                storageHelper.removeToken();
                return {
                  success: false,
                  error: "登录已过期，请重新登录",
                  status: 401,
                  isAuthError: true
                };
              } else {
                return {
                  success: false,
                  error: "请先登录",
                  status: 401,
                  isAuthError: true
                };
              }
            case 403:
              throw new Error("没有权限访问该资源");
            case 404:
              return {
                success: false,
                error: "NOT_FOUND",
                status: 404,
                message: "请求的资源不存在"
              };
            case 500:
              throw new Error("服务器内部错误");
            default:
              throw new Error(errorData.message || "请求失败");
          }
        }
        return response.json();
      }
      // 基础请求方法 - 支持自动切换备用接口
      async request(endpoint, options = {}) {
        const makeRequest = async (baseURL) => {
          const url = `${baseURL}${endpoint}`;
          const config = {
            headers: this.addAuthHeaders(options.headers),
            ...options
          };
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const response = await fetch(url, {
              ...config,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            return await this.handleResponse(response);
          } catch (error2) {
            clearTimeout(timeoutId);
            if (error2.name === "AbortError") {
              throw new Error("请求超时，请检查网络连接");
            }
            throw error2;
          }
        };
        try {
          return await makeRequest(this.currentURL);
        } catch (error2) {
          if (this.isNetworkError(error2) && !this.isUsingFallback) {
            console.warn("主要接口请求失败，尝试备用接口:", error2.message);
            await new Promise((resolve) => setTimeout(resolve, FALLBACK_RETRY_DELAY));
            try {
              this.switchToFallback();
              return await makeRequest(this.currentURL);
            } catch (fallbackError) {
              console.error("备用接口也无法访问:", fallbackError.message);
              throw error2;
            }
          }
          throw error2;
        }
      }
      // GET请求
      async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: "GET" });
      }
      // POST请求
      async post(endpoint, data = {}) {
        return this.request(endpoint, {
          method: "POST",
          body: JSON.stringify(data)
        });
      }
      // PUT请求
      async put(endpoint, data = {}) {
        return this.request(endpoint, {
          method: "PUT",
          body: JSON.stringify(data)
        });
      }
      // DELETE请求
      async delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
      }
    }
    const api = new ApiClient();
    const authAPI = {
      // 获取工作量证明挑战
      getChallenge() {
        return api.get("/auth/challenge");
      },
      // 用户注册（包含工作量证明）
      register(userData) {
        return api.post("/auth/register", userData);
      },
      // 用户登录
      login(credentials) {
        return api.post("/auth/login", credentials);
      },
      // 邮箱验证
      verifyEmail(verificationData) {
        return api.post("/auth/verify-email", verificationData);
      },
      // 重新发送验证码
      resendVerificationCode(data) {
        return api.post("/auth/resend-code", data);
      },
      // 获取用户信息
      getUserInfo() {
        return api.get("/user/profile");
      },
      // 获取当前用户信息（别名）
      getCurrentUser() {
        return api.get("/user/profile");
      },
      // 用户登出
      logout() {
        return api.post("/auth/logout");
      },
      // 忘记密码
      forgotPassword(data) {
        return api.post("/auth/forgot-password", data);
      },
      // 重置密码
      resetPassword(data) {
        return api.post("/auth/reset-password", data);
      }
    };
    const linkAPI = {
      // 获取主题的观看链接（支持电影、音乐、书籍、游戏）
      getSubjectLinks(subjectId, category = "movies", params = {}) {
        return api.get(`/subjects/${category}/${subjectId}/links`, params);
      },
      // 获取主题的所有链接（一次性返回所有类型）
      getAllSubjectLinks(subjectId, category = "movies", params = {}) {
        return api.get(`/subjects/${category}/${subjectId}/all-links`, params);
      },
      // 获取电影的观看链接（保持向后兼容）
      getMovieLinks(subjectId, params = {}) {
        return api.get(`/movie/${subjectId}/links`, params);
      },
      // 添加主题观看链接（支持电影、音乐、书籍、游戏）
      addSubjectLink(subjectId, category = "movies", linkData) {
        return api.post(`/subjects/${category}/${subjectId}/links`, linkData);
      },
      // 添加观看链接（保持向后兼容）
      addMovieLink(movieId, linkData) {
        return api.post(`/movies/${movieId}/links`, linkData);
      },
      // 更新主题观看链接（支持电影、音乐、书籍、游戏）
      updateSubjectLink(subjectId, linkId, category = "movies", linkData) {
        return api.put(`/subjects/${category}/${subjectId}/links/${linkId}`, linkData);
      },
      updateMovieLink(linkId, linkData) {
        return api.put(`/movies/links/${linkId}`, linkData);
      },
      // 删除主题观看链接（支持电影、音乐、书籍、游戏）
      deleteSubjectLink(subjectId, linkId, category = "movies") {
        return api.delete(`/subjects/${category}/${subjectId}/links/${linkId}`);
      },
      // 删除观看链接（保持向后兼容）
      deleteMovieLink(movieId, linkId) {
        return api.delete(`/movies/${movieId}/links/${linkId}`);
      },
      // 投票链接（支持不同链接类型）
      voteLink(linkId, voteType, linkType = "movie") {
        return api.post(`/links/${linkId}/vote`, {
          vote_type: voteType,
          link_type: linkType
        });
      },
      // 取消投票（已废弃，现在通过重复投票来取消）
      removeVote(linkId, voteType, linkType = "movie") {
        return api.post(`/links/${linkId}/vote`, {
          vote_type: voteType,
          link_type: linkType
        });
      },
      // 获取链接投票状态
      getLinkVoteStatus(linkId, linkType = "movie") {
        return api.get(`/links/${linkId}/vote-status`, { link_type: linkType });
      },
      // 获取用户投票状态（别名方法，保持API一致性）
      getUserVote(linkId, linkType = "movie") {
        return api.get(`/links/${linkId}/vote-status`, { link_type: linkType });
      },
      // 反馈链接
      reportLink(reportData) {
        return api.post("/reports", reportData);
      }
    };
    const seekAPI = {
      // 提交求资源请求
      submitSeekRequest(data) {
        return api.post("/seek", data);
      }
    };
    const userAPI = {
      // 获取用户资料
      getUserProfile(userId2) {
        return api.get(`/user/profile/`);
      },
      // 获取用户链接
      getUserLinks(params = {}) {
        return api.get("/user/links", params);
      },
      // 按分类获取用户链接
      getUserLinksByCategory() {
        return api.get("/user/links/category");
      },
      // 更新用户名
      updateUserName(data) {
        return api.put("/user/name", data);
      },
      // 获取所有用户列表（管理员）
      getAllUsers() {
        return api.get("/admin/users");
      },
      // 封禁用户（管理员）
      banUser(userId2, reason) {
        return api.put(`/admin/users/${userId2}/ban`, { reason });
      },
      // 解封用户（管理员）
      unbanUser(userId2) {
        return api.put(`/admin/users/${userId2}/unban`);
      }
    };
    async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return hashHex;
    }
    function checkDifficulty(hash, difficulty) {
      return hash.startsWith("0".repeat(difficulty));
    }
    async function solveChallenge(challenge, difficulty, onProgress = null) {
      let nonce = 0;
      const startTime = Date.now();
      while (true) {
        const message = challenge + nonce.toString();
        const hash = await sha256(message);
        if (checkDifficulty(hash, difficulty)) {
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(`工作量证明完成: nonce=${nonce}, 耗时=${duration}ms, hash=${hash}`);
          return {
            challenge,
            nonce: nonce.toString(),
            hash
          };
        }
        nonce++;
        if (nonce % 1e3 === 0) {
          if (onProgress) {
            onProgress(nonce);
          }
          await new Promise((resolve) => setTimeout(resolve, 1));
        }
      }
    }
    const user = ref(null);
    const token = ref(null);
    const loading = ref(false);
    const error = ref("");
    const initialized = ref(false);
    const initPromise = ref(null);
    const isAuthenticated = computed(() => !!user.value && !!token.value);
    const userEmail = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.email) || "";
    });
    const userId = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.id) || "";
    });
    const userStore$1 = {
      // 状态
      user,
      token,
      loading,
      error,
      initialized,
      // 计算属性
      isAuthenticated,
      userEmail,
      userId,
      // 方法
      async initAuth() {
        if (initialized.value) return;
        if (initPromise.value) {
          console.log("复用正在进行的认证初始化请求");
          return initPromise.value;
        }
        initPromise.value = (async () => {
          try {
            loading.value = true;
            const storedToken = storageHelper.getToken();
            const storedUser = storageHelper.getUser();
            if (storedToken) {
              token.value = storedToken;
              if (storedUser) {
                user.value = storedUser;
                console.log("使用本地存储的用户信息:", storedUser);
              }
              try {
                const result = await authAPI.getCurrentUser();
                if (result && result.data) {
                  user.value = result.data;
                  storageHelper.setUser(result.data);
                } else if (result) {
                  user.value = result;
                  storageHelper.setUser(result);
                }
                error.value = "";
              } catch (err) {
                console.error("获取用户信息失败:", err);
                if (err.status === 401) {
                  storageHelper.removeToken();
                  storageHelper.removeUser();
                  token.value = null;
                  user.value = null;
                  console.log("Token已过期，已清除登录状态");
                } else {
                  console.warn("网络或其他错误，保留登录状态:", err.message || err);
                  if (!storedUser && storedToken) {
                    console.warn("首次网络失败且无本地用户信息，保持token但清空用户状态");
                  }
                }
              }
            }
          } catch (err) {
            console.error("初始化认证失败:", err);
          } finally {
            loading.value = false;
            initialized.value = true;
            initPromise.value = null;
          }
        })();
        return initPromise.value;
      },
      async signIn(email, password) {
        try {
          loading.value = true;
          error.value = "";
          const result = await authAPI.login({ email, password });
          token.value = result.data.token;
          user.value = result.data.user;
          storageHelper.setToken(result.data.token);
          storageHelper.setUser(result.data.user);
          return { success: true, user: result.data.user };
        } catch (err) {
          console.error("登录错误:", err);
          error.value = err.message || "登录过程中发生错误";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      async signUp(email, password, userData = {}) {
        try {
          loading.value = true;
          error.value = "";
          const result = await authAPI.register({ email, password, ...userData });
          token.value = result.token;
          user.value = result.user;
          storageHelper.setToken(result.token);
          return { success: true, data: result };
        } catch (err) {
          console.error("注册错误:", err);
          error.value = err.message || "注册过程中发生错误";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      // 带工作量证明的注册
      async signUpWithProof(formData, onProgress) {
        try {
          loading.value = true;
          error.value = "";
          const challengeResponse = await authAPI.getChallenge();
          if (!challengeResponse.success) {
            throw new Error(challengeResponse.error || "获取挑战失败");
          }
          const { challenge, difficulty } = challengeResponse.data;
          const proof = await solveChallenge(challenge, difficulty, onProgress);
          const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            proof_of_work: {
              challenge,
              nonce: proof.nonce,
              hash: proof.hash
            }
          };
          const response = await authAPI.register(registerData);
          if (response.success) {
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.error };
          }
        } catch (err) {
          console.error("注册失败:", err);
          error.value = err.message || "注册失败";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      // 验证邮箱
      async verifyEmail(email, code) {
        try {
          loading.value = true;
          error.value = "";
          const verificationData = {
            email,
            code
          };
          const response = await authAPI.verifyEmail(verificationData);
          if (response.success) {
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.error };
          }
        } catch (err) {
          console.error("邮箱验证失败:", err);
          error.value = err.message || "验证失败";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      // 重新发送验证码
      async resendVerificationCode(email, onProgress = () => {
      }) {
        try {
          loading.value = true;
          error.value = "";
          const challengeResponse = await authAPI.getChallenge();
          if (!challengeResponse.success) {
            throw new Error(challengeResponse.error || "获取挑战失败");
          }
          const { challenge, difficulty } = challengeResponse.data;
          const proof = await solveChallenge(challenge, difficulty, onProgress);
          const requestData = {
            email,
            challenge,
            solution: proof.nonce
          };
          const response = await authAPI.resendVerificationCode(requestData);
          if (response.success) {
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.error };
          }
        } catch (err) {
          console.error("重发验证码失败:", err);
          error.value = err.message || "发送失败";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      // 忘记密码
      async forgotPassword(email, onProgress) {
        try {
          loading.value = true;
          error.value = "";
          const challengeResponse = await authAPI.getChallenge();
          if (!challengeResponse.success) {
            throw new Error(challengeResponse.error || "获取挑战失败");
          }
          const { challenge, difficulty } = challengeResponse.data;
          const proof = await solveChallenge(challenge, difficulty, onProgress);
          const requestData = {
            email,
            proof_of_work: {
              challenge,
              nonce: proof.nonce,
              hash: proof.hash
            }
          };
          const response = await authAPI.forgotPassword(requestData);
          if (response.success) {
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.message || response.error };
          }
        } catch (err) {
          console.error("忘记密码失败:", err);
          error.value = err.message || "发送失败";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      // 重置密码
      async resetPassword(email, code, newPassword) {
        try {
          loading.value = true;
          error.value = "";
          const response = await authAPI.resetPassword({ email, code, password: newPassword });
          if (response.success) {
            return { success: true, data: response.data };
          } else {
            return { success: false, error: response.message || response.error };
          }
        } catch (err) {
          console.error("重置密码失败:", err);
          error.value = err.message || "重置失败";
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      async signOut() {
        try {
          loading.value = true;
          error.value = "";
          storageHelper.removeToken();
          storageHelper.removeUser();
          token.value = null;
          user.value = null;
          return { success: true };
        } catch (err) {
          console.error("登出错误:", err);
          error.value = "登出过程中发生错误";
          storageHelper.removeToken();
          storageHelper.removeUser();
          token.value = null;
          user.value = null;
          return { success: false, error: error.value };
        } finally {
          loading.value = false;
        }
      },
      clearError() {
        error.value = "";
      },
      // 检查用户是否有特定权限（可扩展）
      hasPermission(permission) {
        if (!user.value) return false;
        return true;
      },
      // 获取用户显示名称
      getDisplayName() {
        var _a;
        if (!user.value) return "未登录";
        return ((_a = user.value.user_metadata) == null ? void 0 : _a.full_name) || user.value.email || "用户";
      },
      // 获取用户头像URL（如果有的话）
      getAvatarUrl() {
        var _a;
        if (!user.value) return null;
        return ((_a = user.value.user_metadata) == null ? void 0 : _a.avatar_url) || null;
      }
    };
    class LinkService {
      // 缓存时间2秒，防止短时间内重复请求
      /**
       * 获取指定电影的所有链接
       * @param {string} movieId - 电影ID
       * @param {Object} options - 查询选项
       * @param {string} options.linkType - 链接类型过滤 ('netdisk', 'bt', 'online')
       * @param {string} options.platform - 平台过滤
       * @param {string} options.sortBy - 排序方式 ('created_at', 'likes_count', 'like_rate')
       * @param {string} options.sortOrder - 排序顺序 ('asc', 'desc')
       * @param {number} options.limit - 限制数量
       * @param {number} options.offset - 偏移量
       */
      static async getLinks(subjectId, options = {}) {
        try {
          const params = {};
          const { linkType, platform, page = 1, limit = 5, sortBy = "created_at", sortOrder = "desc", category = "movies" } = options;
          if (page) params.page = page;
          if (limit) params.limit = limit;
          if (sortBy) params.sort_by = sortBy;
          if (sortOrder) params.sort_order = sortOrder;
          if (linkType) {
            params.type = linkType === "bt" ? "magnet" : linkType;
          }
          if (platform) params.platform = platform;
          const result = await linkAPI.getSubjectLinks(subjectId, category, params);
          if (!result.success) {
            if (result.error === "NOT_FOUND" || result.status === 404) {
              console.log("电影不存在，返回空结果");
              throw new Error("电影不存在");
            }
            console.error("获取链接失败:", result.error);
            throw new Error(`获取链接失败: ${result.error}`);
          }
          const responseData = result.data || {};
          let links = responseData.links || [];
          const pagination = responseData.pagination || {};
          if (!Array.isArray(links)) {
            console.warn("API返回的links不是数组格式:", links);
            links = [];
          }
          const transformedLinks = links.map((link) => ({
            ...link,
            up_votes: link.likes_count || 0,
            down_votes: link.dislikes_count || 0,
            // 在加载时就计算评分，而不是等到投票时才计算
            score: (link.likes_count || 0) - (link.dislikes_count || 0),
            user_vote_type: link.user_vote_type === "like" ? "up" : link.user_vote_type === "dislike" ? "down" : link.user_vote_type || "",
            // 将username字段映射为user_display_name以保持前端兼容性
            user_display_name: link.username || "匿名用户"
          }));
          return {
            success: true,
            data: transformedLinks,
            pagination,
            count: transformedLinks.length,
            total: pagination.total || 0
          };
        } catch (err) {
          console.error("获取链接服务错误:", err);
          return {
            success: false,
            error: err.message || "获取链接失败",
            data: [],
            pagination: { page: 1, limit: 5, total: 0, pages: 0 },
            count: 0,
            total: 0
          };
        }
      }
      /**
       * 获取指定主题的所有链接（一次性获取所有类型）
       * @param {string} subjectId - 主题ID
       * @param {string} category - 类别 (movies, albums 等)
       */
      static async getAllLinks(subjectId, category = "movies") {
        const cacheKey = `all_links_${category}_${subjectId}`;
        const now = Date.now();
        if (this.cache.has(cacheKey)) {
          const cached = this.cache.get(cacheKey);
          if (now - cached.timestamp < this.CACHE_TTL || cached.promise) {
            if (cached.promise) {
              console.log("复用正在进行的getAllLinks请求:", cacheKey);
              return cached.promise;
            }
            console.log("使用getAllLinks缓存:", cacheKey);
            return cached.data;
          }
        }
        const fetchPromise = (async () => {
          try {
            const result = await linkAPI.getAllSubjectLinks(subjectId, category);
            if (!result.success) {
              if (result.error === "NOT_FOUND" || result.status === 404) {
                console.log("主题不存在，返回空结果");
                return { success: true, data: {}, seekerStats: {}, userSeekStatus: {} };
              }
              console.error("获取所有链接失败:", result.error);
              throw new Error(`获取所有链接失败: ${result.error}`);
            }
            const responseData = result.data || {};
            const processedData = {};
            for (const type in responseData) {
              if (Array.isArray(responseData[type])) {
                processedData[type] = responseData[type].map((link) => ({
                  ...link,
                  up_votes: link.likes_count || 0,
                  down_votes: link.dislikes_count || 0,
                  score: (link.likes_count || 0) - (link.dislikes_count || 0),
                  user_vote_type: link.user_vote_type === "like" ? "up" : link.user_vote_type === "dislike" ? "down" : link.user_vote_type || "",
                  user_display_name: link.username || "匿名用户"
                }));
              }
            }
            const seekerStats = responseData.seeker_stats || {};
            const userSeekStatus = responseData.user_seek_status || {};
            const finalResult = {
              success: true,
              data: processedData,
              seekerStats,
              userSeekStatus
            };
            this.cache.set(cacheKey, {
              timestamp: Date.now(),
              data: finalResult,
              promise: null
            });
            return finalResult;
          } catch (err) {
            console.error("获取所有链接服务错误:", err);
            this.cache.delete(cacheKey);
            return {
              success: false,
              error: err.message || "获取所有链接失败",
              data: {},
              seekerStats: {},
              userSeekStatus: {}
            };
          }
        })();
        this.cache.set(cacheKey, {
          timestamp: now,
          data: null,
          promise: fetchPromise
        });
        return fetchPromise;
      }
      /**
       * 提交求资源请求
       * @param {Object} seekData
       * @param {string} seekData.subject_id
       * @param {string} seekData.subject_type
       * @param {string} seekData.seek_type
       * @param {string} seekData.platform
       */
      static async seekResource(seekData) {
        try {
          const result = await seekAPI.submitSeekRequest(seekData);
          if (result.success === false) {
            throw new Error(result.error || "提交请求失败");
          }
          return {
            success: true,
            data: result,
            stats_key: result.stats_key
            // 提取 stats_key
          };
        } catch (err) {
          console.error("求资源请求失败:", err);
          return {
            success: false,
            error: err.message || "求资源请求失败"
          };
        }
      }
      /**
       * 添加新链接
       * @param {Object} linkData - 链接数据
       * @param {string} linkData.movieId - 电影ID
       * @param {string} linkData.linkType - 链接类型
       * @param {string} linkData.platform - 平台名称
       * @param {string} linkData.url - 链接地址
       * @param {string} linkData.extractCode - 提取码（可选）
       * @param {string} linkData.title - 标题（可选）
       * @param {string} linkData.quality - 画质（可选）
       * @param {string} linkData.size - 文件大小（可选）
       * @param {boolean} linkData.has_4k - 是否支持4K（可选）
       * @param {boolean} linkData.has_hdr - 是否支持HDR（可选）
       * @param {boolean} linkData.has_dolby_atmos - 是否支持杜比全景声（可选）
       * @param {boolean} linkData.has_subtitles - 是否包含字幕（可选）
       * @param {boolean} linkData.is_flac - 是否为FLAC无损（可选，音乐）
       * @param {boolean} linkData.is_wav - 是否为WAV无损（可选，音乐）
       */
      static async addLink(linkData) {
        try {
          const {
            subjectId,
            movieId,
            // 保持向后兼容
            category = "movies",
            linkType,
            platform,
            url,
            extractCode,
            title,
            quality,
            size,
            original_url,
            has_4k,
            has_hdr,
            has_dolby_atmos,
            has_subtitles,
            is_flac,
            is_wav
          } = linkData;
          const id = subjectId || movieId;
          if (!id || !linkType || !url) {
            throw new Error("缺少必填字段：subjectId, linkType, url");
          }
          if (!["netdisk", "bt", "magnet", "online"].includes(linkType)) {
            throw new Error("无效的链接类型");
          }
          if (extractCode && extractCode.length > 10) {
            throw new Error("提取码长度不能超过10个字符");
          }
          const challengeResult = await authAPI.getChallenge();
          if (!challengeResult.success) {
            throw new Error("获取工作量证明挑战失败");
          }
          const { challenge, difficulty } = challengeResult.data;
          const proofOfWork = await solveChallenge(challenge, difficulty);
          const linkPayload = {
            title: title || "",
            url: url.trim(),
            type: linkType === "bt" ? "magnet" : linkType,
            password: extractCode || "",
            quality: quality || "",
            size: size || "",
            original_url: original_url || "",
            has_4k: !!has_4k,
            has_hdr: !!has_hdr,
            has_dolby_atmos: !!has_dolby_atmos,
            has_subtitles: !!has_subtitles,
            is_flac: !!is_flac,
            is_wav: !!is_wav,
            proof_of_work: proofOfWork
          };
          if (linkType === "netdisk" && platform && platform.trim()) {
            linkPayload.platform = platform.trim();
          }
          const result = await linkAPI.addSubjectLink(id, category, linkPayload);
          if (!result.success) {
            console.error("添加链接失败:", result.error);
            throw new Error(`添加链接失败: ${result.error}`);
          }
          return {
            success: true,
            data: result.data,
            message: "链接添加成功"
          };
        } catch (err) {
          console.error("添加链接服务错误:", err);
          return {
            success: false,
            error: err.message || "添加链接失败"
          };
        }
      }
      /**
       * 删除链接
       * @param {string} subjectId - 主题ID
       * @param {string} linkId - 链接ID
       * @param {string} category - 主题类别
       */
      static async deleteLink(subjectId, linkId, category = "movies") {
        try {
          if (!linkId) {
            throw new Error("链接ID不能为空");
          }
          if (!subjectId) {
            throw new Error("主题ID不能为空");
          }
          if (!userStore$1.isAuthenticated.value) {
            throw new Error("用户未登录");
          }
          const result = await linkAPI.deleteSubjectLink(subjectId, linkId, category);
          if (!result.success) {
            console.error("删除链接失败:", result.error);
            throw new Error(`删除链接失败: ${result.error}`);
          }
          return {
            success: true,
            message: result.message || "链接删除成功"
          };
        } catch (err) {
          console.error("删除链接服务错误:", err);
          return {
            success: false,
            error: err.message || "删除链接失败"
          };
        }
      }
      static async updateLink(linkId, linkData, subjectId = null, category = "movies") {
        try {
          if (!linkId) {
            throw new Error("链接ID不能为空");
          }
          if (!userStore$1.isAuthenticated.value) {
            throw new Error("用户未登录");
          }
          if (!linkData.url || !linkData.linkType) {
            throw new Error("链接地址和类型不能为空");
          }
          const requestData = {
            title: linkData.title || "",
            url: linkData.url,
            type: linkData.linkType,
            platform: linkData.platform || "",
            password: linkData.extractCode || "",
            size: linkData.size || "",
            original_url: linkData.original_url || "",
            has_4k: linkData.has_4k || false,
            has_hdr: linkData.has_hdr || false,
            has_dolby_atmos: linkData.has_dolby_atmos || false,
            has_subtitles: linkData.has_subtitles || false,
            is_flac: linkData.is_flac || false,
            is_wav: linkData.is_wav || false
          };
          let result;
          if (subjectId) {
            result = await linkAPI.updateSubjectLink(subjectId, linkId, category, requestData);
          } else {
            result = await linkAPI.updateMovieLink(linkId, requestData);
          }
          if (!result.success) {
            console.error("修改链接失败:", result.error);
            throw new Error(`修改链接失败: ${result.error}`);
          }
          return {
            success: true,
            message: result.message || "链接修改成功",
            data: result.data
          };
        } catch (err) {
          console.error("修改链接服务错误:", err);
          return {
            success: false,
            error: err.message || "修改链接失败"
          };
        }
      }
      /**
       * 为链接投票
       * @param {string} linkId - 链接ID
       * @param {string} voteType - 投票类型 ('up' | 'down')
       * @param {string} linkType - 链接类型 ('movie' | 'album' | 'book' | 'game')
       */
      static async voteLink(linkId, voteType, linkType = "movie") {
        try {
          if (!linkId || !voteType) {
            throw new Error("链接ID和投票类型不能为空");
          }
          if (!["up", "down"].includes(voteType)) {
            throw new Error("无效的投票类型");
          }
          if (!userStore$1.isAuthenticated.value) {
            throw new Error("用户未登录");
          }
          const apiVoteType = voteType === "up" ? "like" : "dislike";
          const result = await linkAPI.voteLink(linkId, apiVoteType, linkType);
          if (!result.success) {
            console.error("投票失败:", result.error);
            throw new Error(`投票失败: ${result.error}`);
          }
          const responseData = result.data || {};
          return {
            success: true,
            message: `${voteType === "up" ? "点赞" : "点踩"}成功`,
            data: {
              up_votes: responseData.likes_count || 0,
              down_votes: responseData.dislikes_count || 0,
              user_vote_type: responseData.user_vote_type === "like" ? "up" : responseData.user_vote_type === "dislike" ? "down" : null
            }
          };
        } catch (err) {
          console.error("投票服务错误:", err);
          return {
            success: false,
            error: err.message || "投票失败"
          };
        }
      }
      /**
       * 取消投票
       * @param {string} linkId - 链接ID
       * @param {number} currentUpVotes - 当前点赞数
       * @param {number} currentDownVotes - 当前点踩数
       * @param {string} voteType - 取消的投票类型 ('up' 或 'down')
       * @param {string} linkType - 链接类型 ('movie' | 'album' | 'book' | 'game')
       */
      static async removeVote(linkId, currentUpVotes = 0, currentDownVotes = 0, voteType = "up", linkType = "movie") {
        try {
          if (!linkId) {
            throw new Error("链接ID不能为空");
          }
          if (!userStore$1.isAuthenticated.value) {
            throw new Error("用户未登录");
          }
          const apiVoteType = voteType === "up" ? "like" : "dislike";
          const result = await linkAPI.removeVote(linkId, apiVoteType, linkType);
          if (!result.success) {
            console.error("取消投票失败:", result.error);
            throw new Error(`取消投票失败: ${result.error}`);
          }
          const responseData = result.data || {};
          console.log("removeVote API原始响应:", responseData);
          let finalUpVotes, finalDownVotes;
          if (responseData.likes_count !== void 0 && responseData.dislikes_count !== void 0) {
            const apiUpVotes = Math.max(0, responseData.likes_count || 0);
            const apiDownVotes = Math.max(0, responseData.dislikes_count || 0);
            if (responseData.likes_count < 0 || responseData.dislikes_count < 0) {
              console.warn("API返回负数，使用本地计算:", responseData);
              if (voteType === "up") {
                finalUpVotes = Math.max(0, currentUpVotes - 1);
                finalDownVotes = currentDownVotes;
              } else {
                finalUpVotes = currentUpVotes;
                finalDownVotes = Math.max(0, currentDownVotes - 1);
              }
            } else {
              finalUpVotes = apiUpVotes;
              finalDownVotes = apiDownVotes;
            }
            console.log("使用API返回数据:", { finalUpVotes, finalDownVotes, apiUpVotes, apiDownVotes });
          } else {
            if (voteType === "up") {
              finalUpVotes = Math.max(0, currentUpVotes - 1);
              finalDownVotes = currentDownVotes;
            } else {
              finalUpVotes = currentUpVotes;
              finalDownVotes = Math.max(0, currentDownVotes - 1);
            }
            console.log("使用本地计算数据:", { finalUpVotes, finalDownVotes, currentUpVotes, currentDownVotes, voteType });
          }
          return {
            success: true,
            message: "取消投票成功",
            data: {
              up_votes: finalUpVotes,
              down_votes: finalDownVotes,
              user_vote_type: null
              // 取消投票后用户投票状态为null
            }
          };
        } catch (err) {
          console.error("取消投票服务错误:", err);
          return {
            success: false,
            error: err.message || "取消投票失败"
          };
        }
      }
      /**
       * 反馈链接
       * @param {string} linkId - 链接ID
       * @param {string} type - 反馈类型
       * @param {string} reason - 反馈原因（可选）
       * @param {string} linkType - 链接类型 ('movie' | 'album' | 'book' | 'game')
       */
      static async reportLink(linkId, type, reason = "", linkType = "movie") {
        try {
          if (!linkId || !type) {
            throw new Error("链接ID和反馈类型不能为空");
          }
          if (!userStore$1.isAuthenticated.value) {
            throw new Error("用户未登录");
          }
          const reportData = {
            link_id: linkId,
            link_type: linkType,
            type: type.trim(),
            reason: reason.trim() || null
          };
          const result = await linkAPI.reportLink(reportData);
          if (!result.success) {
            console.error("反馈失败:", result.error);
            throw new Error(`反馈失败: ${result.error}`);
          }
          const data = result.data;
          return {
            success: true,
            data,
            message: "反馈提交成功"
          };
        } catch (err) {
          console.error("反馈服务错误:", err);
          return {
            success: false,
            error: err.message || "反馈失败"
          };
        }
      }
    }
    // 静态缓存对象
    __publicField(LinkService, "cache", /* @__PURE__ */ new Map());
    __publicField(LinkService, "CACHE_TTL", 2e3);
    const _hoisted_1$c = { class: "content-wrapper" };
    const _hoisted_2$a = { class: "navigation-bar" };
    const _hoisted_3$7 = { class: "icon-wrapper" };
    const _hoisted_4$6 = { class: "icon-wrapper" };
    const _hoisted_5$5 = { class: "icon-wrapper" };
    const _hoisted_6$4 = { class: "icon-wrapper" };
    const _hoisted_7$4 = { class: "tab-content" };
    const _hoisted_8$4 = {
      key: 0,
      class: "tab-panel"
    };
    const _hoisted_9$4 = {
      key: 1,
      class: "no-subject"
    };
    const _hoisted_10$4 = {
      key: 1,
      class: "tab-panel"
    };
    const _sfc_main$c = {
      __name: "WindowContent",
      setup(__props) {
        const LinkManager2 = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(() => LinkManager$1));
        const AuthComponent2 = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(() => AuthComponent$1));
        const activeTab = ref("links");
        const linkType = ref("netdisk");
        const subjectId = ref("");
        const subjectCategory = ref("");
        const subjectInfo = ref({ title: "", year: "", rating: "", category: "" });
        const linkCounts = ref({
          netdisk: 0,
          bt: 0,
          online: 0
        });
        ref(false);
        const setActiveTab = (tab, type = null) => {
          activeTab.value = tab;
          if (tab === "links" && type) {
            linkType.value = type;
          }
        };
        const getDoubanSubjectInfo = () => {
          try {
            const url = window.location.href;
            let category = "";
            let match = null;
            if (url.includes("movie.douban.com/subject/")) {
              category = "movies";
              match = url.match(/\/subject\/(\d+)\/?/);
            } else if (url.includes("music.douban.com/subject/")) {
              category = "albums";
              match = url.match(/\/subject\/(\d+)\/?/);
            } else if (url.includes("book.douban.com/subject/")) {
              category = "books";
              match = url.match(/\/subject\/(\d+)\/?/);
            } else if (url.includes("www.douban.com/game/")) {
              category = "games";
              match = url.match(/\/game\/(\d+)\/?/);
            }
            if (match && category) {
              const newSubjectId = match[1];
              if (subjectId.value !== newSubjectId || subjectCategory.value !== category) {
                subjectId.value = newSubjectId;
                subjectCategory.value = category;
                subjectInfo.value.category = category;
                fetchLinkCounts();
              }
            } else {
              if (subjectId.value || subjectCategory.value) {
                subjectId.value = "";
                subjectCategory.value = "";
                subjectInfo.value = { title: "", year: "", rating: "", category: "" };
                linkCounts.value = { netdisk: 0, bt: 0, online: 0 };
              }
              return;
            }
            const titleElement = document.querySelector('h1 span[property="v:itemreviewed"]') || document.querySelector("h1 span") || document.querySelector("h1");
            if (titleElement) {
              subjectInfo.value.title = titleElement.textContent.trim();
            }
            const yearElement = document.querySelector(".year") || document.querySelector("span.year");
            if (yearElement) {
              const yearMatch = yearElement.textContent.match(/(\d{4})/);
              if (yearMatch) {
                subjectInfo.value.year = yearMatch[1];
              }
            }
            const ratingElement = document.querySelector(".rating_num") || document.querySelector('[property="v:average"]');
            if (ratingElement) {
              subjectInfo.value.rating = ratingElement.textContent.trim();
            }
          } catch (error2) {
            console.error("获取豆瓣主题信息失败:", error2);
          }
        };
        let fetchTimer = null;
        const fetchLinkCounts = async () => {
          if (!subjectId.value || !subjectCategory.value) return;
          if (fetchTimer) clearTimeout(fetchTimer);
          fetchTimer = setTimeout(async () => {
            try {
              const result = await LinkService.getAllLinks(subjectId.value, subjectCategory.value);
              if (result.success && result.data) {
                linkCounts.value.netdisk = (result.data.netdisk || []).length;
                linkCounts.value.bt = (result.data.magnet || []).length;
                linkCounts.value.online = (result.data.online || []).length;
              }
            } catch (e) {
              console.error("获取链接数量失败", e);
            } finally {
              fetchTimer = null;
            }
          }, 300);
        };
        const updateLinkCounts = (counts) => {
          if (counts) {
            linkCounts.value = { ...linkCounts.value, ...counts };
          }
        };
        onMounted(() => {
          getDoubanSubjectInfo();
          const observer = new MutationObserver(() => {
            if (window.location.href.includes("/subject/") || window.location.href.includes("/game/")) {
              setTimeout(getDoubanSubjectInfo, 500);
            }
          });
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          if (!userStore.initialized.value) {
            userStore.initAuth();
          }
          const handleSwitchToUserTab = (event) => {
            if (event.detail && event.detail.tab === "user") {
              setActiveTab("user");
            }
          };
          document.addEventListener("switchToUserTab", handleSwitchToUserTab);
          return () => {
            document.removeEventListener("switchToUserTab", handleSwitchToUserTab);
          };
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", _hoisted_1$c, [
            createBaseVNode("div", _hoisted_2$a, [
              createBaseVNode("button", {
                class: normalizeClass(["nav-btn", { active: activeTab.value === "links" && linkType.value === "netdisk" }]),
                onClick: _cache[0] || (_cache[0] = ($event) => setActiveTab("links", "netdisk"))
              }, [
                createBaseVNode("div", _hoisted_3$7, [
                  createVNode(NetdiskIcon),
                  createBaseVNode("span", {
                    class: normalizeClass(["count-badge", { "invisible": linkCounts.value.netdisk <= 0 }])
                  }, toDisplayString(linkCounts.value.netdisk || 0), 3)
                ]),
                _cache[4] || (_cache[4] = createBaseVNode("span", null, "网盘", -1))
              ], 2),
              createBaseVNode("button", {
                class: normalizeClass(["nav-btn", { active: activeTab.value === "links" && linkType.value === "bt" }]),
                onClick: _cache[1] || (_cache[1] = ($event) => setActiveTab("links", "bt"))
              }, [
                createBaseVNode("div", _hoisted_4$6, [
                  createVNode(BtIcon),
                  createBaseVNode("span", {
                    class: normalizeClass(["count-badge", { "invisible": linkCounts.value.bt <= 0 }])
                  }, toDisplayString(linkCounts.value.bt || 0), 3)
                ]),
                _cache[5] || (_cache[5] = createBaseVNode("span", null, "磁力", -1))
              ], 2),
              createBaseVNode("button", {
                class: normalizeClass(["nav-btn", { active: activeTab.value === "links" && linkType.value === "online" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => setActiveTab("links", "online"))
              }, [
                createBaseVNode("div", _hoisted_5$5, [
                  createVNode(OnlineIcon),
                  createBaseVNode("span", {
                    class: normalizeClass(["count-badge", { "invisible": linkCounts.value.online <= 0 }])
                  }, toDisplayString(linkCounts.value.online || 0), 3)
                ]),
                _cache[6] || (_cache[6] = createBaseVNode("span", null, "在线", -1))
              ], 2),
              createBaseVNode("button", {
                class: normalizeClass(["nav-btn", { active: activeTab.value === "user" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => setActiveTab("user"))
              }, [
                createBaseVNode("div", _hoisted_6$4, [
                  createVNode(UserIcon),
                  _cache[7] || (_cache[7] = createBaseVNode("span", { class: "count-badge invisible" }, "0", -1))
                ]),
                _cache[8] || (_cache[8] = createBaseVNode("span", null, "用户", -1))
              ], 2)
            ]),
            createBaseVNode("div", _hoisted_7$4, [
              activeTab.value === "links" ? (openBlock(), createElementBlock("div", _hoisted_8$4, [
                subjectId.value && subjectCategory.value ? (openBlock(), createBlock(unref(LinkManager2), {
                  key: 0,
                  "subject-id": subjectId.value,
                  "subject-category": subjectCategory.value,
                  "link-type": linkType.value,
                  onCountsUpdated: updateLinkCounts
                }, null, 8, ["subject-id", "subject-category", "link-type"])) : (openBlock(), createElementBlock("div", _hoisted_9$4, _cache[9] || (_cache[9] = [
                  createBaseVNode("p", null, "未检测到支持的豆瓣页面，请在豆瓣详情页使用此功能。", -1),
                  createBaseVNode("p", { class: "hint" }, "支持的页面格式：", -1),
                  createBaseVNode("ul", { class: "hint-list" }, [
                    createBaseVNode("li", null, "电影：https://movie.douban.com/subject/[ID]/"),
                    createBaseVNode("li", null, "专辑：https://music.douban.com/subject/[ID]/"),
                    createBaseVNode("li", null, "书籍：https://book.douban.com/subject/[ID]/"),
                    createBaseVNode("li", null, "游戏：https://www.douban.com/game/[ID]/")
                  ], -1)
                ])))
              ])) : createCommentVNode("", true),
              activeTab.value === "user" ? (openBlock(), createElementBlock("div", _hoisted_10$4, [
                createVNode(unref(AuthComponent2))
              ])) : createCommentVNode("", true)
            ])
          ]);
        };
      }
    };
    const WindowContent = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-71ea894a"]]);
    const CURRENT_VERSION = "1.2.6";
    console.log("DoubanFlix Version:", CURRENT_VERSION);
    const SCRIPTCAT_API_URL = "https://scriptcat.org/scripts/code/4290/DoubanFlix%20-%20%E5%9C%A8%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E8%8E%B7%E5%8F%96%E6%B7%BB%E5%8A%A0%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%88%E7%BD%91%E7%9B%98%EF%BC%8C%E7%A3%81%E5%8A%9B%EF%BC%8C%E5%9C%A8%E7%BA%BF%EF%BC%89.user.js";
    const STORAGE_KEYS = {
      LAST_CHECK_TIME: "doubanflix_last_version_check",
      SKIP_VERSION: "doubanflix_skip_version",
      SKIP_UNTIL: "doubanflix_skip_until"
    };
    function compareVersions(version1, version2) {
      const v1Parts = version1.split(".").map(Number);
      const v2Parts = version2.split(".").map(Number);
      const maxLength = Math.max(v1Parts.length, v2Parts.length);
      for (let i = 0; i < maxLength; i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        if (v1Part > v2Part) return 1;
        if (v1Part < v2Part) return -1;
      }
      return 0;
    }
    async function fetchScriptInfo() {
      return new Promise((resolve) => {
        try {
          if (typeof GM_xmlhttpRequest === "undefined") {
            console.warn("GM_xmlhttpRequest 不可用，可能不在用户脚本环境中");
            resolve({
              success: false,
              error: "GM_xmlhttpRequest API 不可用"
            });
            return;
          }
          GM_xmlhttpRequest({
            method: "GET",
            url: SCRIPTCAT_API_URL,
            headers: {
              "User-Agent": "DoubanFlix Version Checker"
            },
            timeout: 1e4,
            // 10秒超时
            onload: function(response) {
              try {
                if (response.status !== 200) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const scriptContent = response.responseText;
                const versionMatch = scriptContent.match(/@version\s+([^\r\n]+)/);
                const nameMatch = scriptContent.match(/@name\s+([^\r\n]+)/);
                const descriptionMatch = scriptContent.match(/@description\s+([^\r\n]+)/);
                let updateNote = "";
                const lines = scriptContent.split("\n");
                let inUpdateNote = false;
                for (const line of lines) {
                  if (line.trim() === "// ==/UserScript==") {
                    break;
                  }
                  if (line.includes("@updatenote")) {
                    inUpdateNote = true;
                    const firstLineMatch = line.match(/@updatenote\s+(.+)/);
                    if (firstLineMatch) {
                      updateNote = firstLineMatch[1].trim();
                    }
                  } else if (inUpdateNote) {
                    const continuationMatch = line.match(/^\/\/\s+(.+)/);
                    if (continuationMatch && !line.includes("@")) {
                      updateNote += "\n" + continuationMatch[1].trim();
                    } else if (line.trim().startsWith("//") && line.includes("@")) {
                      break;
                    }
                  }
                }
                if (!versionMatch) {
                  throw new Error("无法解析脚本版本信息");
                }
                resolve({
                  version: versionMatch[1].trim(),
                  name: nameMatch ? nameMatch[1].trim() : "DoubanFlix",
                  description: descriptionMatch ? descriptionMatch[1].trim() : "",
                  updateNote: updateNote || "",
                  downloadUrl: SCRIPTCAT_API_URL,
                  success: true
                });
              } catch (error2) {
                console.error("解析脚本信息失败:", error2);
                resolve({
                  success: false,
                  error: error2.message
                });
              }
            },
            onerror: function(error2) {
              console.error("请求脚本信息失败:", error2);
              resolve({
                success: false,
                error: "网络请求失败"
              });
            },
            ontimeout: function() {
              console.error("请求脚本信息超时");
              resolve({
                success: false,
                error: "请求超时"
              });
            }
          });
        } catch (error2) {
          console.error("获取脚本信息失败:", error2);
          resolve({
            success: false,
            error: error2.message
          });
        }
      });
    }
    function shouldSkipVersionCheck() {
      const skipUntil = localStorage.getItem(STORAGE_KEYS.SKIP_UNTIL);
      if (skipUntil) {
        const skipUntilTime = parseInt(skipUntil);
        if (Date.now() < skipUntilTime) {
          return true;
        } else {
          localStorage.removeItem(STORAGE_KEYS.SKIP_UNTIL);
          localStorage.removeItem(STORAGE_KEYS.SKIP_VERSION);
        }
      }
      return false;
    }
    function setSkipVersionCheck(version2, days = 7) {
      const skipUntil = Date.now() + days * 24 * 60 * 60 * 1e3;
      localStorage.setItem(STORAGE_KEYS.SKIP_VERSION, version2);
      localStorage.setItem(STORAGE_KEYS.SKIP_UNTIL, skipUntil.toString());
    }
    let checkPromise = null;
    async function checkForUpdates(force = false) {
      if (checkPromise && !force) {
        console.log("复用正在进行的版本检查请求");
        return checkPromise;
      }
      checkPromise = (async () => {
        try {
          console.log("正在检查版本更新...");
          if (!force && shouldSkipVersionCheck()) {
            return {
              hasUpdate: false,
              skipped: true,
              message: "用户选择暂时跳过版本检查"
            };
          }
          const scriptInfo = await fetchScriptInfo();
          if (!scriptInfo.success) {
            return {
              hasUpdate: false,
              error: true,
              message: `检查更新失败: ${scriptInfo.error}`
            };
          }
          const remoteVersion = scriptInfo.version;
          console.log("检查到最新版本号:", remoteVersion);
          const comparison = compareVersions(remoteVersion, CURRENT_VERSION);
          localStorage.setItem(STORAGE_KEYS.LAST_CHECK_TIME, Date.now().toString());
          if (comparison > 0) {
            return {
              hasUpdate: true,
              currentVersion: CURRENT_VERSION,
              latestVersion: remoteVersion,
              scriptInfo,
              message: `发现新版本 ${remoteVersion}，当前版本 ${CURRENT_VERSION}`
            };
          } else {
            return {
              hasUpdate: false,
              currentVersion: CURRENT_VERSION,
              latestVersion: remoteVersion,
              message: "当前已是最新版本"
            };
          }
        } catch (error2) {
          console.error("版本检查失败:", error2);
          return {
            hasUpdate: false,
            error: true,
            message: `版本检查失败: ${error2.message}`
          };
        } finally {
          checkPromise = null;
        }
      })();
      return checkPromise;
    }
    function getLastCheckTime() {
      const lastCheck = localStorage.getItem(STORAGE_KEYS.LAST_CHECK_TIME);
      return lastCheck ? parseInt(lastCheck) : null;
    }
    function shouldCheckForUpdates(intervalHours = 24) {
      const lastCheck = getLastCheckTime();
      if (!lastCheck) return true;
      const now = Date.now();
      const interval = intervalHours * 60 * 60 * 1e3;
      return now - lastCheck >= interval;
    }
    const versionService = {
      checkForUpdates,
      setSkipVersionCheck,
      shouldSkipVersionCheck,
      getLastCheckTime,
      shouldCheckForUpdates,
      compareVersions,
      CURRENT_VERSION
    };
    const _hoisted_1$b = {
      key: 0,
      class: "custom-window"
    };
    const _hoisted_2$9 = { class: "window-content" };
    const _hoisted_3$6 = { class: "window-header" };
    const _hoisted_4$5 = { class: "tooltip-container" };
    const _hoisted_5$4 = { class: "window-title" };
    const _sfc_main$b = {
      __name: "App",
      setup(__props) {
        const DebugPanel2 = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(() => DebugPanel$1));
        const UpdateNotification2 = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(() => UpdateNotification$1));
        const isVisible = ref(true);
        const asideElementFound = ref(false);
        const windowTitle = ref("DoubanFlix 1.2.6");
        const updateInfo = ref(null);
        const showUpdateNotification = ref(false);
        const waitForAsideElement = () => {
          return new Promise((resolve) => {
            const checkExistingAside = () => {
              const asideElement = document.querySelector(".aside") || document.querySelector("#aside") || document.querySelector(".sidebar") || document.querySelector("#sidebar") || document.querySelector(".right-col") || document.querySelector(".side-panel") || document.querySelector("#content .article") || document.querySelector(".grid-16-8 .aside") || document.querySelector('[class*="aside"]') || document.querySelector('[class*="side"]');
              if (asideElement) {
                console.log("找到aside元素:", asideElement.className || asideElement.tagName);
                resolve(asideElement);
                return true;
              }
              return false;
            };
            if (checkExistingAside()) {
              return;
            }
            const observer = new MutationObserver((mutations) => {
              for (const mutation of mutations) {
                if (mutation.type === "childList") {
                  for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                      if (checkExistingAside()) {
                        observer.disconnect();
                        return;
                      }
                    }
                  }
                }
              }
            });
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
            setTimeout(() => {
              observer.disconnect();
              console.log("超时未找到aside元素，强制显示窗口");
              resolve(null);
            }, 1e4);
          });
        };
        const toggleWindow = () => {
          isVisible.value = !isVisible.value;
          if (isVisible.value && asideElementFound.value) {
            ensureInAside();
          }
        };
        const ensureInAside = () => {
          const windowContainer = document.querySelector("#bilibili-custom-window");
          if (!windowContainer) {
            console.log("未找到Vue应用容器");
            return;
          }
          const asideElement = document.querySelector(".aside") || document.querySelector("#aside") || document.querySelector(".sidebar") || document.querySelector("#sidebar") || document.querySelector(".right-col") || document.querySelector(".side-panel") || document.querySelector("#content .article") || document.querySelector(".grid-16-8 .aside") || document.querySelector('[class*="aside"]') || document.querySelector('[class*="side"]');
          if (asideElement) {
            if (windowContainer.parentNode !== asideElement) {
              if (asideElement.firstChild) {
                asideElement.insertBefore(windowContainer, asideElement.firstChild);
              } else {
                asideElement.appendChild(windowContainer);
              }
              console.log("Vue应用容器已移动到aside元素的第一个位置:", asideElement.className || asideElement.tagName);
            }
          } else {
            console.log("未找到aside元素，Vue应用容器保持在当前位置");
          }
        };
        const checkVersion = async () => {
          try {
            const result = await checkForUpdates();
            if (result.hasUpdate) {
              updateInfo.value = result;
              showUpdateNotification.value = true;
            }
          } catch (error2) {
            console.error("版本检查失败:", error2);
          }
        };
        const handleUpdateNotificationClose = () => {
          showUpdateNotification.value = false;
          updateInfo.value = null;
        };
        const handleUpdate = () => {
          window.open("https://scriptcat.org/scripts/code/4290/DoubanFlix%20-%20%E5%9C%A8%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E8%8E%B7%E5%8F%96%E6%B7%BB%E5%8A%A0%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%88%E7%BD%91%E7%9B%98%EF%BC%8C%E7%A3%81%E5%8A%9B%EF%BC%8C%E5%9C%A8%E7%BA%BF%EF%BC%89.user.js", "_blank");
          handleUpdateNotificationClose();
        };
        const handleUpdateLater = (skipDays = 0) => {
          if (skipDays > 0) {
            setSkipVersionCheck(skipDays);
          }
          handleUpdateNotificationClose();
        };
        const handleToggleWindow = () => {
          toggleWindow();
        };
        const handleKeydown = (event) => {
          if (event.ctrlKey && event.key === "q") {
            event.preventDefault();
            toggleWindow();
          }
        };
        onMounted(async () => {
          userStore$1.initAuth().catch((error2) => {
            console.error("用户认证初始化失败:", error2);
          });
          window.addEventListener("toggle-window", handleToggleWindow);
          document.addEventListener("keydown", handleKeydown);
          await waitForAsideElement();
          asideElementFound.value = true;
          ensureInAside();
          setTimeout(() => {
            checkVersion();
          }, 2e3);
        });
        onUnmounted(() => {
          window.removeEventListener("toggle-window", handleToggleWindow);
          document.removeEventListener("keydown", handleKeydown);
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock(Fragment, null, [
            isVisible.value && asideElementFound.value ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
              createBaseVNode("div", _hoisted_2$9, [
                createVNode(WindowContent)
              ]),
              createBaseVNode("div", _hoisted_3$6, [
                createBaseVNode("div", _hoisted_4$5, [
                  createBaseVNode("span", _hoisted_5$4, toDisplayString(windowTitle.value), 1),
                  _cache[0] || (_cache[0] = createBaseVNode("span", { class: "tooltip" }, "第一条规则是：不准讨论DoubanFlix", -1))
                ])
              ])
            ])) : createCommentVNode("", true),
            createVNode(unref(DebugPanel2)),
            updateInfo.value && showUpdateNotification.value ? (openBlock(), createBlock(unref(UpdateNotification2), {
              key: 1,
              "update-info": updateInfo.value,
              visible: showUpdateNotification.value,
              onClose: handleUpdateNotificationClose,
              onUpdate: handleUpdate,
              onLater: handleUpdateLater
            }, null, 8, ["update-info", "visible"])) : createCommentVNode("", true)
          ], 64);
        };
      }
    };
    const App = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-74a2f745"]]);
    async function initScript() {
      const injectUnlockLogic = () => {
        try {
          let token2 = null;
          if (typeof GM_getValue !== "undefined") {
            token2 = GM_getValue("auth_token", null);
            console.log('[DoubanFlix] GM_getValue("auth_token") result:', token2 ? "Found" : "Empty/Null");
          } else {
            console.error("[DoubanFlix] GM_getValue is undefined! Check @grant permissions.");
          }
          if (!token2) {
            token2 = storageHelper.getToken();
          }
          if (token2) {
            localStorage.setItem("auth_token", token2);
            console.log("[DoubanFlix] Token synced to localStorage successfully");
          } else {
            console.warn("[DoubanFlix] No token found in GM_storage to sync. User might not be logged in.");
          }
        } catch (e) {
          console.warn("[DoubanFlix] Failed to sync token to localStorage", e);
        }
        const meta = document.createElement("meta");
        meta.name = "referrer";
        meta.content = "no-referrer";
        document.head.appendChild(meta);
        console.log("Added no-referrer meta tag");
        const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
        const originalFetch = win.fetch;
        win.fetch = async function(input, init) {
          const url = typeof input === "string" ? input : input.url;
          if (url.includes("api.doubanflix.com/api")) {
            console.log("[DoubanFlix Unlock] Proxying request:", url);
            let headers = {};
            if (init && init.headers) {
              if (init.headers instanceof Headers) {
                init.headers.forEach((value, key) => {
                  headers[key] = value;
                });
              } else {
                headers = { ...init.headers };
              }
            }
            if (!headers["Authorization"]) {
              const token2 = storageHelper.getToken();
              if (token2) {
                headers["Authorization"] = `Bearer ${token2}`;
              }
            }
            if (!headers["Content-Type"] && (init == null ? void 0 : init.body)) {
              headers["Content-Type"] = "application/json";
            }
            return new Promise((resolve, reject) => {
              GM_xmlhttpRequest({
                method: (init == null ? void 0 : init.method) || "GET",
                url,
                headers,
                data: init == null ? void 0 : init.body,
                anonymous: true,
                onload: function(response) {
                  resolve(
                    new Response(response.responseText, {
                      status: response.status,
                      statusText: response.statusText
                    })
                  );
                },
                onerror: function(error2) {
                  console.error("[DoubanFlix Unlock] Request failed:", error2);
                  reject(error2);
                }
              });
            });
          }
          return originalFetch.call(win, input, init);
        };
      };
      injectUnlockLogic();
      const blockAds = () => {
        const targetWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
        if (targetWindow) {
          try {
            Object.defineProperty(targetWindow, "DoubanAdSlots", {
              get: () => [],
              set: () => {
              },
              configurable: false
            });
            Object.defineProperty(targetWindow, "DoubanAdRequest", {
              get: () => ({ src: "", uid: "", bid: "", crtr: "", prv: "", debug: false }),
              set: () => {
              },
              configurable: false
            });
          } catch (e) {
            console.warn("Blocking ads failed:", e);
          }
          if (document.body) {
            const scripts = document.querySelectorAll('script[src*="ad.release.js"], script[src*="erebor.douban.com"]');
            scripts.forEach((script) => script.remove());
            const adContainers = document.querySelectorAll('[id^="dale_"]');
            adContainers.forEach((container) => container.remove());
          }
        }
      };
      blockAds();
      const observer = new MutationObserver((mutations) => {
        let shouldBlock = false;
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
              if (node.tagName === "SCRIPT" && (node.src.includes("ad.release.js") || node.src.includes("erebor.douban.com"))) {
                shouldBlock = true;
                break;
              }
              if (node.id && node.id.startsWith("dale_")) {
                shouldBlock = true;
                break;
              }
            }
          }
          if (shouldBlock) break;
        }
        if (shouldBlock) {
          blockAds();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      const runInit = () => {
        const currentUrl = window.location.href;
        if (currentUrl.includes("doubanflix.com") || currentUrl.includes("localhost")) {
          console.log("[DoubanFlix] Skipping UI rendering on doubanflix.com/localhost");
          return;
        }
        const h1Elements = document.querySelectorAll("h1");
        const articleDiv = document.querySelector(".article");
        if (articleDiv && h1Elements.length > 0) {
          h1Elements.forEach((h1) => {
            articleDiv.insertBefore(h1, articleDiv.firstChild);
          });
        }
        const windowContainer = document.createElement("div");
        windowContainer.id = "bilibili-custom-window";
        document.body.appendChild(windowContainer);
        const app = createApp(App);
        app.mount("#bilibili-custom-window");
        console.log("DoubanFlix应用已初始化");
      };
      const scheduleInit = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", runInit);
        } else {
          runInit();
        }
      };
      scheduleInit();
    }
    initScript();
    const _imports_0 = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20t='1756543843235'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='20280'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='200'%20height='200'%3e%3cpath%20d='M512%20330.666667c14.933333%200%2029.866667%204.266667%2040.533333%2014.933333l277.33333399%20234.666667c27.733333%2023.466667%2029.866667%2064%208.53333301%2089.6-23.466667%2027.733333-64%2029.866667-89.6%208.53333299L512%20477.866667l-236.8%20200.53333299c-27.733333%2023.466667-68.266667%2019.19999999-89.6-8.53333299-23.466667-27.733333-19.19999999-68.266667%208.53333301-89.6l277.33333399-234.666667c10.666667-10.666667%2025.6-14.933333%2040.533333-14.933333z'%20fill='currentColor'%20p-id='20281'%3e%3c/path%3e%3c/svg%3e";
    const _sfc_main$a = {
      name: "CustomSelect",
      props: {
        modelValue: {
          type: [String, Number],
          default: ""
        },
        options: {
          type: Array,
          required: true,
          default: () => []
        },
        placeholder: {
          type: String,
          default: "请选择"
        }
      },
      emits: ["update:modelValue", "change"],
      data() {
        return {
          isOpen: false
        };
      },
      computed: {
        selectedLabel() {
          const selected = this.options.find((option) => option.value === this.modelValue);
          return selected ? selected.label : "";
        }
      },
      mounted() {
        document.addEventListener("click", this.closeDropdown);
      },
      beforeUnmount() {
        document.removeEventListener("click", this.closeDropdown);
      },
      methods: {
        toggleDropdown() {
          this.isOpen = !this.isOpen;
        },
        selectOption(option) {
          this.$emit("update:modelValue", option.value);
          this.$emit("change", option.value);
          this.isOpen = false;
        },
        closeDropdown() {
          this.isOpen = false;
        }
      }
    };
    const _hoisted_1$a = { class: "selected-text" };
    const _hoisted_2$8 = { class: "select-dropdown" };
    const _hoisted_3$5 = ["onClick"];
    function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["custom-select", { "is-open": $data.isOpen }]),
        onClick: _cache[1] || (_cache[1] = withModifiers(() => {
        }, ["stop"]))
      }, [
        createBaseVNode("div", {
          class: "select-trigger",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleDropdown && $options.toggleDropdown(...args))
        }, [
          createBaseVNode("span", _hoisted_1$a, toDisplayString($options.selectedLabel || $props.placeholder), 1),
          createBaseVNode("img", {
            src: _imports_0,
            class: normalizeClass(["arrow", { "arrow-up": $data.isOpen }]),
            alt: "箭头"
          }, null, 2)
        ]),
        withDirectives(createBaseVNode("div", _hoisted_2$8, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.options, (option) => {
            return openBlock(), createElementBlock("div", {
              class: normalizeClass(["select-option", { "selected": option.value === $props.modelValue }]),
              key: option.value,
              onClick: ($event) => $options.selectOption(option)
            }, toDisplayString(option.label), 11, _hoisted_3$5);
          }), 128))
        ], 512), [
          [vShow, $data.isOpen]
        ])
      ], 2);
    }
    const CustomSelect = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$3], ["__scopeId", "data-v-d868d504"]]);
    const _sfc_main$9 = {
      name: "LinkItemSkeleton"
    };
    const _hoisted_1$9 = { class: "link-item skeleton" };
    function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("div", _hoisted_1$9, _cache[0] || (_cache[0] = [
        createStaticVNode('<div class="link-header" data-v-115afd35><div class="platform-badge skeleton-element" data-v-115afd35><div class="skeleton-icon" data-v-115afd35></div></div><div class="link-meta" data-v-115afd35><div class="skeleton-element skeleton-language" data-v-115afd35></div></div></div><div class="link-content" data-v-115afd35><div class="link-title-row" data-v-115afd35><div class="skeleton-element skeleton-title" data-v-115afd35></div><div class="expand-arrow" data-v-115afd35><div class="skeleton-element skeleton-arrow" data-v-115afd35></div></div></div></div>', 2)
      ]));
    }
    const LinkItemSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$2], ["__scopeId", "data-v-115afd35"]]);
    const _hoisted_1$8 = ["checked"];
    const _hoisted_2$7 = {
      key: 0,
      class: "checkbox-label"
    };
    const _sfc_main$8 = {
      __name: "CheckBox",
      props: {
        modelValue: {
          type: Boolean,
          default: false
        },
        label: {
          type: String,
          default: ""
        },
        color: {
          type: String,
          default: "blue",
          validator: (value) => ["blue", "green", "purple", "red"].includes(value)
        }
      },
      emits: ["update:modelValue"],
      setup(__props) {
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("label", {
            class: normalizeClass(["ios-checkbox", __props.color])
          }, [
            createBaseVNode("input", {
              type: "checkbox",
              checked: __props.modelValue,
              onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
            }, null, 40, _hoisted_1$8),
            _cache[1] || (_cache[1] = createBaseVNode("div", { class: "checkbox-wrapper" }, [
              createBaseVNode("div", { class: "checkbox-bg" }),
              createBaseVNode("svg", {
                fill: "none",
                viewBox: "0 0 24 24",
                class: "checkbox-icon"
              }, [
                createBaseVNode("path", {
                  "stroke-linejoin": "round",
                  "stroke-linecap": "round",
                  "stroke-width": "3",
                  stroke: "currentColor",
                  d: "M4 12L10 18L20 6",
                  class: "check-path"
                })
              ])
            ], -1)),
            __props.label ? (openBlock(), createElementBlock("span", _hoisted_2$7, toDisplayString(__props.label), 1)) : createCommentVNode("", true)
          ], 2);
        };
      }
    };
    const CheckBox = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-418f338a"]]);
    const _hoisted_1$7 = { class: "tooltip" };
    const _hoisted_2$6 = { class: "tooltip" };
    const _sfc_main$7 = {
      __name: "CopyTooltip",
      props: {
        text: {
          type: String,
          required: true
        },
        type: {
          type: String,
          default: "url",
          // 'url' 或 'code'
          validator: (value) => ["url", "code"].includes(value)
        }
      },
      emits: ["copy-success", "copy-error"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const emit2 = __emit;
        const isCopied = ref(false);
        const tooltipText = computed(() => {
          if (isCopied.value) {
            return "已复制";
          }
          return props.type === "url" ? "点击复制链接（右键打开）" : "点击复制提取码";
        });
        const formatUrl = (url) => {
          return url;
        };
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(props.text);
            isCopied.value = true;
            emit2("copy-success", props.text);
            setTimeout(() => {
              isCopied.value = false;
            }, 2e3);
          } catch (err) {
            console.error("复制失败:", err);
            emit2("copy-error", err);
          }
        };
        return (_ctx, _cache) => {
          return __props.type === "url" ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["copy-item", { copied: isCopied.value }]),
            onClick: handleCopy
          }, [
            createTextVNode(toDisplayString(formatUrl(__props.text)) + " ", 1),
            createBaseVNode("span", _hoisted_1$7, toDisplayString(tooltipText.value), 1)
          ], 2)) : __props.type === "code" ? (openBlock(), createElementBlock("code", {
            key: 1,
            class: normalizeClass(["extract-code", { copied: isCopied.value }]),
            onClick: handleCopy
          }, [
            createTextVNode(toDisplayString(__props.text) + " ", 1),
            createBaseVNode("span", _hoisted_2$6, toDisplayString(tooltipText.value), 1)
          ], 2)) : createCommentVNode("", true);
        };
      }
    };
    const CopyTooltip = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-aaaa00e5"]]);
    const _hoisted_1$6 = { class: "toast-container" };
    const _sfc_main$6 = {
      __name: "ToastContainer",
      props: {
        errorMessage: {
          type: String,
          default: ""
        },
        successMessage: {
          type: String,
          default: ""
        },
        duration: {
          type: Number,
          default: 3e3
          // 默认3秒后自动消失
        },
        autoClose: {
          type: Boolean,
          default: true
          // 默认开启自动关闭
        }
      },
      emits: ["clear-error", "clear-success"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const emit2 = __emit;
        let errorTimer = null;
        let successTimer = null;
        const clearError = () => {
          if (errorTimer) {
            clearTimeout(errorTimer);
            errorTimer = null;
          }
          emit2("clear-error");
        };
        const clearSuccess = () => {
          if (successTimer) {
            clearTimeout(successTimer);
            successTimer = null;
          }
          emit2("clear-success");
        };
        watch(() => props.errorMessage, (newValue) => {
          if (newValue && props.autoClose) {
            if (errorTimer) {
              clearTimeout(errorTimer);
            }
            errorTimer = setTimeout(() => {
              clearError();
            }, props.duration);
          }
        });
        watch(() => props.successMessage, (newValue) => {
          if (newValue && props.autoClose) {
            if (successTimer) {
              clearTimeout(successTimer);
            }
            successTimer = setTimeout(() => {
              clearSuccess();
            }, props.duration);
          }
        });
        onUnmounted(() => {
          if (errorTimer) {
            clearTimeout(errorTimer);
          }
          if (successTimer) {
            clearTimeout(successTimer);
          }
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", _hoisted_1$6, [
            __props.errorMessage ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "toast error-toast",
              onClick: clearError
            }, [
              createBaseVNode("span", null, toDisplayString(__props.errorMessage), 1),
              _cache[0] || (_cache[0] = createBaseVNode("button", { class: "toast-close" }, "×", -1))
            ])) : createCommentVNode("", true),
            __props.successMessage ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "toast success-toast",
              onClick: clearSuccess
            }, [
              createBaseVNode("span", null, toDisplayString(__props.successMessage), 1),
              _cache[1] || (_cache[1] = createBaseVNode("button", { class: "toast-close" }, "×", -1))
            ])) : createCommentVNode("", true)
          ]);
        };
      }
    };
    const ToastContainer = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-52e28bd4"]]);
    const _sfc_main$5 = {
      name: "UrlInput",
      props: {
        modelValue: {
          type: String,
          default: ""
        },
        placeholder: {
          type: String,
          default: ""
        },
        required: {
          type: Boolean,
          default: false
        },
        recognizedUrl: {
          type: String,
          default: ""
        }
      },
      emits: ["update:modelValue"],
      data() {
        return {
          isFocused: false,
          isUpdating: false
        };
      },
      computed: {
        formattedContent() {
          const text = this.modelValue || "";
          if (!text) return "";
          const recognizedUrl = this.recognizedUrl;
          if (!recognizedUrl) {
            return `<span class="normal-text">${this.escapeHtml(text)}</span>`;
          }
          if (!text.includes(recognizedUrl)) {
            return `<span class="normal-text">${this.escapeHtml(text)}</span>`;
          }
          const recognizedIndex = text.indexOf(recognizedUrl);
          if (recognizedIndex === -1) {
            return `<span class="normal-text">${this.escapeHtml(text)}</span>`;
          }
          let html = "";
          if (recognizedIndex > 0) {
            const beforeText = text.substring(0, recognizedIndex);
            html += `<span class="normal-text">${this.escapeHtml(beforeText)}</span>`;
          }
          html += `<span class="recognized-text">${this.escapeHtml(recognizedUrl)}</span>`;
          const afterIndex = recognizedIndex + recognizedUrl.length;
          if (afterIndex < text.length) {
            const afterText = text.substring(afterIndex);
            html += `<span class="normal-text">${this.escapeHtml(afterText)}</span>`;
          }
          return html;
        }
      },
      methods: {
        escapeHtml(text) {
          const div = document.createElement("div");
          div.textContent = text;
          return div.innerHTML;
        },
        handleInput(event) {
          if (this.isUpdating) return;
          const selection = window.getSelection();
          let cursorOffset = 0;
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(event.target);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            cursorOffset = preCaretRange.toString().length;
          }
          const text = event.target.textContent || "";
          this.isUpdating = true;
          this.$emit("update:modelValue", text);
          this.$nextTick(() => {
            this.setCursorPosition(cursorOffset);
            this.isUpdating = false;
          });
        },
        handlePaste(event) {
          event.preventDefault();
          this.isUpdating = true;
          const clipboardData = event.clipboardData || window.clipboardData;
          const pastedText = clipboardData.getData("text");
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(this.$refs.editableInput);
          preCaretRange.setEnd(range.startContainer, range.startOffset);
          const cursorOffset = preCaretRange.toString().length;
          range.deleteContents();
          range.insertNode(document.createTextNode(pastedText));
          const newCursorOffset = cursorOffset + pastedText.length;
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          const newText = this.$refs.editableInput.textContent || "";
          setTimeout(() => {
            this.$emit("update:modelValue", newText);
            this.$nextTick(() => {
              this.setCursorPosition(newCursorOffset);
              this.isUpdating = false;
            });
          }, 50);
        },
        handleFocus() {
          this.isFocused = true;
        },
        handleBlur() {
          this.isFocused = false;
        },
        handleKeydown(event) {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        },
        updateContent() {
          if (!this.$refs.editableInput) return;
          const currentText = this.$refs.editableInput.textContent || "";
          const modelText = this.modelValue || "";
          if (currentText === modelText) {
            return;
          }
          this.isUpdating = true;
          const selection = window.getSelection();
          let cursorOffset = 0;
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(this.$refs.editableInput);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            cursorOffset = preCaretRange.toString().length;
          }
          if (currentText !== modelText) {
            this.$refs.editableInput.innerHTML = this.formattedContent;
            this.$nextTick(() => {
              this.setCursorPosition(cursorOffset);
              this.isUpdating = false;
            });
          } else {
            this.isUpdating = false;
          }
        },
        setCursorPosition(offset) {
          const element = this.$refs.editableInput;
          if (!element) return;
          const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          let currentOffset = 0;
          let targetNode = null;
          let targetOffset = 0;
          while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
              targetNode = node;
              targetOffset = offset - currentOffset;
              break;
            }
            currentOffset += nodeLength;
          }
          if (targetNode) {
            const range = document.createRange();
            range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent.length));
            range.collapse(true);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      },
      watch: {
        modelValue(newValue) {
          if (!this.isUpdating) {
            const currentText = this.$refs.editableInput ? this.$refs.editableInput.textContent || "" : "";
            if (currentText !== (newValue || "")) {
              this.$nextTick(() => {
                this.updateContent();
              });
            }
          }
        },
        recognizedUrl() {
          if (!this.isUpdating) {
            this.$nextTick(() => {
              this.updateContent();
            });
          }
        }
      },
      mounted() {
        if (this.modelValue) {
          this.updateContent();
        }
      }
    };
    const _hoisted_1$5 = { class: "url-input-container" };
    const _hoisted_2$5 = ["data-placeholder", "innerHTML"];
    function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createBaseVNode("div", {
          class: normalizeClass(["input-wrapper", { "focused": $data.isFocused }])
        }, [
          createBaseVNode("div", {
            ref: "editableInput",
            class: "editable-input",
            contenteditable: "true",
            "data-placeholder": $props.placeholder,
            onInput: _cache[0] || (_cache[0] = (...args) => $options.handleInput && $options.handleInput(...args)),
            onFocus: _cache[1] || (_cache[1] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
            onBlur: _cache[2] || (_cache[2] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
            onPaste: _cache[3] || (_cache[3] = (...args) => $options.handlePaste && $options.handlePaste(...args)),
            onKeydown: _cache[4] || (_cache[4] = (...args) => $options.handleKeydown && $options.handleKeydown(...args)),
            innerHTML: $options.formattedContent
          }, null, 40, _hoisted_2$5)
        ], 2)
      ]);
    }
    const UrlInput = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$1], ["__scopeId", "data-v-dad514cd"]]);
    const NETDISK_PLATFORMS = {
      "quark": {
        domains: ["pan.quark.cn"]
      },
      "ali": {
        domains: ["www.aliyundrive.com", "www.alipan.com"]
      },
      "baidu": {
        domains: ["pan.baidu.com"]
      },
      "tianyi": {
        domains: ["cloud.189.cn", "content.21cn.com"]
      },
      "mobile": {
        domains: ["caiyun.139.com", "yun.139.com"]
      },
      "115": {
        domains: ["115.com", "115cdn.com", "anxia.com"]
      },
      "xunlei": {
        domains: ["pan.xunlei.com"]
      },
      "uc": {
        domains: ["drive.uc.cn"]
      },
      "123": {
        domains: ["www.123684.com"]
      },
      "lanzou": {
        domains: ["lanzou.com", "lanzous.com", "lanzoux.com", "lanzoui.com", "lanzouv.com", "lanzouw.com", "lanzouy.com", "lanzn.com", "wwi.lanzn.com"]
      }
    };
    const MAGNET_PATTERN = /^magnet:\?xt=urn:btih:[a-fA-F0-9]{32,40}/;
    const DOMAIN_TO_PLATFORM = /* @__PURE__ */ new Map();
    for (const [platform, config] of Object.entries(NETDISK_PLATFORMS)) {
      config.domains.forEach((domain) => {
        DOMAIN_TO_PLATFORM.set(domain, platform);
      });
    }
    function detectLinkType(url) {
      if (!url || typeof url !== "string") {
        return { type: null, platform: null, isValid: false };
      }
      const trimmedUrl = url.trim();
      if (MAGNET_PATTERN.test(trimmedUrl)) {
        return {
          type: "bt",
          platform: null,
          isValid: true
        };
      }
      let urlObj = null;
      try {
        urlObj = new URL(trimmedUrl);
      } catch (e) {
        return {
          type: null,
          platform: null,
          isValid: false
        };
      }
      const platform = DOMAIN_TO_PLATFORM.get(urlObj.hostname);
      if (platform) {
        return {
          type: "netdisk",
          platform,
          isValid: true
        };
      }
      if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
        return {
          type: "online",
          platform: null,
          isValid: true
        };
      }
      return {
        type: null,
        platform: null,
        isValid: false
      };
    }
    function extractPasswordFromUrl(url) {
      if (!url || typeof url !== "string") {
        return null;
      }
      const passwordPatterns = [
        /[?&]password=([a-zA-Z0-9]+)/i,
        /[?&]pwd=([a-zA-Z0-9]+)/i,
        /#([a-zA-Z0-9]{4})$/,
        // 115网盘的密码格式
        /提取码[：:]\s*([a-zA-Z0-9]+)/i,
        /密码[：:]\s*([a-zA-Z0-9]+)/i,
        /访问码[：:]\s*([a-zA-Z0-9]+)/i,
        /验证码[：:]\s*([a-zA-Z0-9]+)/i,
        /code[：:]\s*([a-zA-Z0-9]+)/i
      ];
      for (const pattern of passwordPatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    }
    function cleanUrl(input) {
      if (!input || typeof input !== "string") {
        return "";
      }
      let cleaned = input.trim();
      const httpUrlMatch = cleaned.match(/(https?:\/\/[^\s\(\)\[\]\（\）]+)/);
      if (httpUrlMatch) {
        return httpUrlMatch[1];
      }
      const magnetMatch = cleaned.match(/(magnet:\?[^\s\(\)\[\]\（\）]+)/);
      if (magnetMatch) {
        return magnetMatch[1];
      }
      cleaned = cleaned.split("\n")[0].trim();
      const urlWithBracketMatch = cleaned.match(/^(https?:\/\/[^\s\(\)]+)\([^)]*\)(.*)$/);
      if (urlWithBracketMatch) {
        return urlWithBracketMatch[1];
      }
      const bracketMatch = cleaned.match(/^([^\(\)]+?)\s*\([^)]*\)/);
      if (bracketMatch) {
        const urlPart = bracketMatch[1].trim();
        if (/^https?:\/\//.test(urlPart) || /^magnet:/.test(urlPart)) {
          return urlPart;
        }
      }
      return cleaned;
    }
    function detectFeaturesFromTitle(title) {
      if (!title || typeof title !== "string") {
        return {
          has_4k: false,
          has_hdr: false,
          has_dolby_atmos: false,
          file_size: null,
          is_flac: false,
          is_wav: false
        };
      }
      title.toLowerCase();
      const sizePatterns = [
        // 各种括号包围的格式 - 只识别M、G、T单位
        /[\(\[\（【](\d+(?:\.\d+)?[MGT]B?)[\)\]\）】]/gi,
        // (1.79GB) [500MB] （2.5G） 【12.82GB】
        /[\(\[\（【](\d+(?:\.\d+)?[mgt]b?)[\)\]\）】]/gi,
        // (1.79gb) [500mb] （2.5g） 【12.82gb】
        // 中文描述格式 - 只识别M、G、T单位
        /容量(\d+(?:\.\d+)?[MGT]B?)/gi,
        // 容量111GB
        /大小(\d+(?:\.\d+)?[MGT]B?)/gi,
        // 大小111GB
        /(\d+(?:\.\d+)?[MGT]B?)容量/gi,
        // 111GB容量
        /(\d+(?:\.\d+)?[MGT]B?)大小/gi,
        // 111GB大小
        // 竖线分隔格式 - 只识别M、G、T单位
        /[\|｜](\d+(?:\.\d+)?[MGT]B?)[\|｜]/gi,
        // |111GB|
        /[\s\|｜](\d+(?:\.\d+)?[MGT]B?)[\s\|｜]/gi,
        // 空格或竖线分隔的大小
        // 独立的大小信息（没有括号包围）- 只识别M、G、T单位
        /(?:^|\s)(\d+(?:\.\d+)?[MGT]B?)(?=\s|$)/gi,
        // 20GB 10G（独立出现）
        /(?:单集|每集|共计|总计|总共)(\d+(?:\.\d+)?[MGT]B?)/gi,
        // 单集10G
        /(\d+(?:\.\d+)?[MGT]B?)(?:单集|每集|共计|总计|总共)/gi
        // 10G单集
      ];
      let file_size = null;
      let sizeMatches = [];
      for (const pattern of sizePatterns) {
        const matches = title.match(pattern);
        if (matches && matches.length > 0) {
          const sizes = matches.map((match) => {
            const sizeMatch = match.match(/(\d+(?:\.\d+)?[KMGTkmgt]B?)/i);
            if (sizeMatch) {
              let size = sizeMatch[1];
              if (size.endsWith("GB")) {
                size = size.slice(0, -1);
              } else if (size.endsWith("MB")) {
                size = size.slice(0, -1);
              } else if (size.endsWith("KB")) {
                size = size.slice(0, -1);
              } else if (size.endsWith("TB")) {
                size = size.slice(0, -1);
              }
              size = size.toUpperCase();
              return size;
            }
            return null;
          }).filter(Boolean);
          if (sizes.length > 0) {
            file_size = sizes.join(" + ");
            sizeMatches = matches;
            break;
          }
        }
      }
      let titleForOtherDetection = title;
      if (sizeMatches.length > 0) {
        sizeMatches.forEach((match) => {
          titleForOtherDetection = titleForOtherDetection.replace(match, " ");
        });
      }
      const has_4k = /(^|[^a-zA-Z0-9])(4k|4K|2160p|2160P|3840x2160|3840X2160)([^a-zA-Z]|$)/i.test(titleForOtherDetection);
      const has_hdr = /(^|[^a-zA-Z])(hdr|HDR|hdr[\d\+]*|HDR[\d\+]*|dolby\s*vision|Dolby\s*Vision|dolbyvision|DolbyVision)([^a-zA-Z]|$)/i.test(title);
      const has_dolby_atmos = /(^|[^a-zA-Z\u4e00-\u9fff])(ddp[\d\.]*\s*atmos|DDP[\d\.]*\s*Atmos|杜比全景声|dolby\s*atmos|Dolby\s*Atmos|全景声|杜比音效|杜比立体声|杜比数字音效|杜比环绕声|杜比\s*[\u4e00-\u9fff]*音[\u4e00-\u9fff]*|dolby\s*[\w\s]*audio|Dolby\s*[\w\s]*Audio)([^a-zA-Z\u4e00-\u9fff]|$)/i.test(title);
      const is_flac = /(^|[^a-zA-Z])(flac|FLAC|\.flac|\.FLAC|无损flac|FLAC无损|flac无损)([^a-zA-Z]|$)/i.test(title);
      const is_wav = /(^|[^a-zA-Z])(wav|WAV|\.wav|\.WAV|无损wav|WAV无损|wav无损)([^a-zA-Z]|$)/i.test(title);
      return {
        has_4k,
        has_hdr,
        has_dolby_atmos,
        file_size,
        is_flac,
        is_wav
      };
    }
    function autoFillFormData(input) {
      const passwordFromInput = extractPasswordFromUrl(input);
      const cleanedUrl = cleanUrl(input);
      const detection = detectLinkType(cleanedUrl);
      const passwordFromUrl = extractPasswordFromUrl(cleanedUrl);
      const finalPassword = passwordFromInput || passwordFromUrl;
      return {
        linkType: detection.type || "",
        platform: detection.platform || "",
        extractCode: finalPassword || "",
        cleanedUrl,
        isValid: detection.isValid
      };
    }
    const http = {
      ajax: (options) => {
        return new Promise((resolve, reject) => {
          console.log("[LinkChecker] 发送请求:", {
            method: options.type || "GET",
            url: options.url,
            headers: options.headers || {}
          });
          if (typeof GM_xmlhttpRequest !== "undefined") {
            console.log("[LinkChecker] 使用 GM_xmlhttpRequest");
            GM_xmlhttpRequest({
              method: options.type || "GET",
              url: options.url,
              headers: options.headers || {},
              data: options.data,
              timeout: options.timeout || 1e4,
              onload: function(response) {
                console.log("[LinkChecker] 请求成功:", {
                  status: response.status,
                  url: options.url,
                  responseLength: response.responseText ? response.responseText.length : 0
                });
                if (options.dataType === "json") {
                  try {
                    const data = JSON.parse(response.responseText);
                    options.success && options.success(data);
                    resolve(data);
                  } catch (e) {
                    console.warn("[LinkChecker] JSON解析错误:", e);
                    options.success && options.success(response.responseText);
                    resolve(response.responseText);
                  }
                } else {
                  options.success && options.success(response.responseText);
                  resolve(response.responseText);
                }
              },
              onerror: function(response) {
                console.error("[LinkChecker] 请求失败:", {
                  status: response.status,
                  statusText: response.statusText,
                  url: options.url
                });
                options.error && options.error(response);
                reject(new Error(`Request failed: ${response.statusText}`));
              },
              ontimeout: function() {
                console.error("[LinkChecker] 请求超时:", options.url);
                options.error && options.error({ status: 0, statusText: "Timeout" });
                reject(new Error("Request timeout"));
              }
            });
          } else {
            console.log("[LinkChecker] 使用原生 XMLHttpRequest");
            const xhr = new XMLHttpRequest();
            xhr.open(options.type || "GET", options.url, true);
            if (options.headers) {
              Object.keys(options.headers).forEach((key) => {
                xhr.setRequestHeader(key, options.headers[key]);
              });
            }
            xhr.timeout = options.timeout || 1e4;
            xhr.onload = function() {
              if (xhr.status >= 200 && xhr.status < 300) {
                console.log("[LinkChecker] 原生请求成功:", {
                  status: xhr.status,
                  url: options.url,
                  responseLength: xhr.responseText ? xhr.responseText.length : 0
                });
                if (options.dataType === "json") {
                  try {
                    const data = JSON.parse(xhr.responseText);
                    options.success && options.success(data);
                    resolve(data);
                  } catch (e) {
                    console.warn("[LinkChecker] JSON解析错误:", e);
                    options.success && options.success(xhr.responseText);
                    resolve(xhr.responseText);
                  }
                } else {
                  options.success && options.success(xhr.responseText);
                  resolve(xhr.responseText);
                }
              } else {
                console.error("[LinkChecker] 原生请求失败:", {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  url: options.url
                });
                options.error && options.error(xhr);
                reject(new Error(`Request failed: ${xhr.statusText}`));
              }
            };
            xhr.onerror = function() {
              options.error && options.error(xhr);
              reject(new Error("Network error"));
            };
            xhr.ontimeout = function() {
              options.error && options.error(xhr);
              reject(new Error("Request timeout"));
            };
            if (options.data) {
              if (options.data instanceof FormData) {
                xhr.send(options.data);
              } else if (typeof options.data === "string") {
                xhr.send(options.data);
              } else {
                xhr.send(JSON.stringify(options.data));
              }
            } else {
              xhr.send();
            }
          }
        });
      }
    };
    const logger = {
      info: (...args) => console.log("[LinkChecker]", ...args),
      debug: (...args) => console.debug("[LinkChecker]", ...args),
      warn: (...args) => console.warn("[LinkChecker]", ...args),
      error: (...args) => console.error("[LinkChecker]", ...args)
    };
    const constant = {
      baidu: {
        reg: /(?:https?:\/\/)?\b(e?yun|pan)\.baidu\.com\/s\/([\w\-]{5,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/s\/([\w\-]{5,})(?!\.)/gi,
        prefix: "https://pan.baidu.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("🔍 百度网盘检测开始:", shareId);
          let url = shareId && shareId.includes && shareId.includes("http") ? shareId : "https://pan.baidu.com/s/" + shareId;
          logger.info("📡 请求URL:", url);
          http.ajax({
            type: "get",
            url,
            success: (response) => {
              logger.info("百度网盘响应:", {
                shareId,
                responseLength: response ? response.length : 0,
                responsePreview: response ? response.substring(0, 200) : "null",
                responseType: typeof response
              });
              let state = 1;
              if (!response || typeof response !== "string") {
                state = 0;
                logger.warn("百度网盘无响应或响应格式错误");
              } else if (response.includes("过期时间：")) {
                state = 1;
                logger.info("百度网盘链接有效（包含过期时间）");
              } else if (response.includes("输入提取码") || response.includes("请输入提取码") || response.includes("输入提取")) {
                state = 2;
                logger.info("百度网盘需要提取码");
              } else if (response.includes("不存在") || response.includes("已失效")) {
                state = -1;
                logger.warn("百度网盘链接失效");
              } else {
                logger.info("百度网盘链接有效");
              }
              const result = { state };
              logger.info("百度网盘检测结果:", result);
              callback && callback(result);
            },
            error: function(error2) {
              logger.error("💥 百度网盘请求失败:", error2);
              callback && callback({ state: 0 });
            }
          });
        }
      },
      weiyun: {
        reg: /(?:https?:\/\/)?\bshare\.weiyun\.com\/([\w\-]{7,})(?!.)(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?share\.weiyun\.com\/([\w\-]{7,})(?!\.)/gi,
        prefix: "https://share.weiyun.com/",
        checkFun: (shareId, callback) => {
          let url = shareId && shareId.includes && shareId.includes("http") ? shareId : "https://share.weiyun.com/" + shareId;
          http.ajax({
            type: "get",
            url,
            success: (response) => {
              let state = 0;
              logger.info(shareId, "weiyun", response);
              if (!response || typeof response !== "string") {
                state = 0;
              } else if (response.includes("已删除") || response.includes("违反相关法规") || response.includes("已过期") || response.includes("已经删除") || response.includes("目录无效")) {
                state = -1;
              } else if (response.includes('"need_pwd":null') && response.includes('"pwd":""')) {
                state = 1;
              } else if (response.includes('"need_pwd":1') || response.includes('"pwd":"')) {
                state = 2;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      lanzou: {
        reg: /(?:https?:\/\/)?(?:[\w\-]+\.)?\blanzou.?\.com\/([\w\-]{7,})(?!\.)(?:\/)?/gi,
        replaceReg: /(?:https?:\/\/)?(?:[\w\-]+\.)?lan(?:zou?|.v|z).?\.com\/([\w\-]{7,})(?!\.)(?:\/)?/gi,
        prefix: "https://www.lanzoum.com/",
        checkFun: (shareId, callback) => {
          let url = shareId && shareId.includes && shareId.includes("http") ? shareId : "https://www.lanzoum.com/" + shareId;
          http.ajax({
            type: "get",
            url,
            success: (response) => {
              let state = 1;
              if (!response || typeof response !== "string") {
                state = 0;
              } else if (response.includes("输入密码")) {
                state = 2;
              } else if (response.includes("来晚啦") || response.includes("不存在")) {
                state = -1;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      aliyun: {
        reg: /(?:https?:\/\/)?www\.aliyundrive\.com\/s\/([\w\-]{8,})(?![.\/])$/gi,
        replaceReg: /(?:https?:\/\/)?www\.ali(?:pan|yundrive)\.com\/s\/([\w\-]{8,})(?![.\/])/gi,
        prefix: "https://www.aliyundrive.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("aliyun id ", shareId);
          http.ajax({
            type: "post",
            url: "https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous",
            data: JSON.stringify({ share_id: shareId }),
            headers: { "Content-Type": "application/json" },
            dataType: "json",
            success: (response) => {
              logger.debug("aliyun response ", response);
              let state = 1;
              if (!response || typeof response !== "object") {
                state = 0;
              } else if (response["code"] && response["code"].indexOf("ShareLink") > -1) {
                state = -1;
              } else if (response["code"] || response["file_count"] && response["file_count"] == 0) {
                state = 0;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      pan123: {
        reg: /(?:h?ttps?:\/\/)?(?:www\.)?\b(?:123pan|123865)\.com\/s\/([\w\-]{8,})\b/gi,
        replaceReg: /(?:h?ttps?:\/\/)?(?:www\.)?(?:123pan|123865)\.com\/s\/([\w\-]{8,})(\.html)?\b/gi,
        prefix: "https://www.123pan.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("Pan123 check id " + shareId);
          http.ajax({
            type: "get",
            url: "https://www.123pan.com/api/share/info?shareKey=" + shareId,
            success: (response) => {
              logger.debug("Pan123 check response", response);
              let rsp = typeof response == "string" ? JSON.parse(response) : response;
              let state = 1;
              if (!response) {
                state = 0;
              } else if (typeof response === "string" && response.includes("分享页面不存在") || rsp && rsp.code != 0) {
                state = -1;
              } else if (rsp && rsp.data && rsp.data.HasPwd) {
                state = 2;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      quark: {
        reg: /(?:https?:\/\/)?\bpan.quark\.cn\/s\/([\w\-]{8,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?pan.quark\.cn\/s\/([\w\-]{8,})(?!\.)/gi,
        prefix: "https://pan.quark.cn/s/",
        checkFun: (shareId, callback) => {
          logger.info("Quark check id " + shareId);
          http.ajax({
            type: "post",
            data: JSON.stringify({
              pwd_id: shareId,
              passcode: ""
            }),
            url: "https://drive-h.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc",
            headers: {
              "Content-Type": "application/json"
            },
            dataType: "json",
            success: (response) => {
              logger.debug("Quark token response", response);
              let rsp = typeof response == "string" ? JSON.parse(response) : response;
              let state = 0;
              logger.debug("Quark token rsp", rsp.message);
              if (!response || !rsp) {
                state = 0;
              } else if (rsp.message && rsp.message.includes("需要提取码")) {
                state = 2;
              } else if (rsp.message && rsp.message.includes("ok")) {
                var token2 = rsp.data.stoken.replace(/\+/g, "%2B").replace(/\"/g, "%22").replace(/\'/g, "%27").replace(/\//g, "%2F");
                const timestamp = Date.now();
                const detailUrl = "https://drive-h.quark.cn/1/clouddrive/share/sharepage/detail?pr=ucpro&fr=pc&uc_param_str=&ver=2&pwd_id=" + shareId + "&stoken=" + token2 + "&pdir_fid=0&force=0&_page=1&_size=50&_fetch_banner=1&_fetch_share=1&fetch_relate_conversation=1&_fetch_total=1&_sort=file_type:asc,file_name:asc&__dt=" + Math.floor(Math.random() * 1e4) + "&__t=" + timestamp;
                http.ajax({
                  type: "get",
                  url: detailUrl,
                  success: (response2) => {
                    logger.debug("checkQuark detail response", response2);
                    let rsp2 = typeof response2 == "string" ? JSON.parse(response2) : response2;
                    let state2 = 0;
                    if (rsp2 && rsp2.status === 404 && rsp2.code === 41004) {
                      state2 = -1;
                      logger.warn("Quark file not found (404):", rsp2.message);
                      callback && callback({ state: state2 });
                      return;
                    }
                    if (rsp2 && rsp2.status && rsp2.status !== 200) {
                      state2 = -1;
                      logger.warn("Quark request failed:", {
                        status: rsp2.status,
                        code: rsp2.code,
                        message: rsp2.message
                      });
                      callback && callback({ state: state2 });
                      return;
                    }
                    if (rsp2 && rsp2.data && rsp2.data.share) {
                      if (rsp2.data.share.status == 1) {
                        state2 = rsp2.data.share.partial_violation ? 11 : 1;
                      } else if (rsp2.data.share.status == 3) {
                        state2 = rsp2.data.share.partial_violation ? -1 : 1;
                      } else if (rsp2.data.share.status > 1) {
                        state2 = -1;
                      }
                    }
                    callback && callback({ state: state2 });
                  },
                  error: function() {
                    callback && callback({ state: 0 });
                  }
                });
              } else {
                state = -1;
              }
              if (!rsp.message || !rsp.message.includes("ok")) {
                callback && callback({ state });
              }
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      baidu2: {
        reg: /(?:https?:\/\/)?\b(e?yun|pan)\.baidu\.com\/(?:share|wap)\/init\?surl=([\w\-]{5,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/(?:share|wap)\/init\?surl=([\w\-]{5,})(?!\.)/gi,
        prefix: "https://pan.baidu.com/share/init?surl=",
        checkFun: (shareId, callback) => {
          logger.info("Baidu2 check id " + shareId);
          let url = shareId && shareId.includes && shareId.includes("http") ? shareId : "https://pan.baidu.com/s/" + shareId;
          http.ajax({
            type: "get",
            url,
            success: (response) => {
              logger.debug("Baidu2 check response", response);
              let state = 1;
              if (!response || typeof response !== "string") {
                state = 0;
              } else if (response.includes("输入提取码") || response.includes("请输入提取码")) {
                state = 2;
              } else if (response.includes("不存在") || response.includes("已失效")) {
                state = -1;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      aliyun2: {
        reg: /(?:https?:\/\/)?(?:(?:www\.)?aliyundrive\.com\/s|alywp\.net)\/([A-Za-z0-9]+)/gi,
        replaceReg: /(?:https?:\/\/)?(?:(?:www\.)?aliyundrive\.com\/s|alywp\.net)\/([A-Za-z0-9]+)/gi,
        prefix: "https://www.aliyundrive.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("Aliyun2 check id " + shareId);
          http.ajax({
            type: "post",
            url: "https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous",
            data: JSON.stringify({ share_id: shareId }),
            headers: { "Content-Type": "application/json" },
            dataType: "json",
            success: (response) => {
              logger.debug("Aliyun2 check response", response);
              let state = 1;
              if (!response || typeof response !== "object") {
                state = 0;
              } else if (response["code"] && response["code"].indexOf("ShareLink") > -1) {
                state = -1;
              } else if (response["code"] || response["file_count"] && response["file_count"] == 0) {
                state = 0;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      ty189: {
        reg: /(?:https?:\/\/)?cloud\.189\.cn\/(?:t\/|web\/share\?code=)([\w\-]{8,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?cloud\.189\.cn\/(?:t\/|web\/share\?code=)([\w\-]{8,})(?!\.)/gi,
        prefix: "https://cloud.189.cn/t/",
        aTagRepalce: [/\/web\/share\?code=/, "/t/"],
        checkFun: (shareId, callback) => {
          logger.info("Ty189 check id " + shareId);
          http.ajax({
            type: "post",
            url: "https://api.cloud.189.cn/open/share/getShareInfoByCodeV2.action",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `shareCode=${encodeURIComponent(shareId)}`,
            success: (response) => {
              logger.debug("Ty189 check response", response);
              let state = 1;
              if (!response) {
                state = 0;
              } else if (response.includes("ShareInfoNotFound") || response.includes("ShareNotFound") || response.includes("FileNotFound") || response.includes("ShareExpiredError") || response.includes("ShareAuditNotPass")) {
                state = -1;
              } else if (response.includes("needAccessCode")) {
                state = 2;
              }
              callback && callback({ state });
            },
            error: () => callback && callback({ state: 0 })
          });
        }
      },
      xunlei: {
        reg: /(?:https?:\/\/)?\bpan.xunlei\.com\/s\/([\w\-]{25,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?pan.xunlei\.com\/s\/([\w\-]{25,})(?!\.)/gi,
        prefix: "https://pan.xunlei.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("Xunlei check id " + shareId);
          http.ajax({
            type: "post",
            data: JSON.stringify({
              client_id: "Xqp0kJBXWhwaTpB6",
              device_id: "925b7631473a13716b791d7f28289cad",
              action: "get:/drive/v1/share",
              meta: {
                package_name: "pan.xunlei.com",
                client_version: "1.45.0",
                captcha_sign: "1.fe2108ad808a74c9ac0243309242726c",
                timestamp: "1645241033384"
              }
            }),
            headers: { "Content-Type": "application/json" },
            url: "https://xluser-ssl.xunlei.com/v1/shield/captcha/init",
            success: (response) => {
              logger.debug("Xunlei token response", response);
              let rsp = JSON.parse(response);
              let token2 = rsp.captcha_token;
              http.ajax({
                type: "get",
                url: "https://api-pan.xunlei.com/drive/v1/share?share_id=" + shareId.replace("https://pan.xunlei.com/s/", ""),
                headers: {
                  "x-captcha-token": token2,
                  "x-client-id": "Xqp0kJBXWhwaTpB6",
                  "x-device-id": "925b7631473a13716b791d7f28289cad"
                },
                success: (response2) => {
                  logger.debug("Xunlei detail response", response2);
                  let state = 1;
                  if (!response2) {
                    state = 0;
                  } else if (response2.includes("NOT_FOUND") || response2.includes("SENSITIVE_RESOURCE") || response2.includes("EXPIRED")) {
                    state = -1;
                  } else if (response2.includes("PASS_CODE_EMPTY")) {
                    state = 2;
                  }
                  callback && callback({ state });
                },
                error: function() {
                  callback && callback({ state: 0 });
                }
              });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      nainiu: {
        reg: /(?:https?:\/\/)?(?:[\w\-]+\.)?\bcowtransfer\.com\/s\/([\w\-]{10,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?(?:[\w\-]+\.)?cowtransfer\.com\/s\/([\w\-]{10,})(?!\.)/gi,
        prefix: "https://cowtransfer.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("Nainiu check id " + shareId);
          http.ajax({
            type: "get",
            url: "https://cowtransfer.com/core/api/transfer/share?uniqueUrl=" + shareId,
            success: (response) => {
              logger.debug("Nainiu check response", response);
              let rsp = typeof response == "string" ? JSON.parse(response) : response;
              let state = 1;
              if (!response) {
                state = 0;
              } else if (rsp.code != "0000") {
                state = -1;
              } else if (rsp.data.needPassword && rsp.data.needPassword) {
                state = 2;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      wenshushu: {
        reg: /(?:https?:\/\/)?\bt.wss.ink\/f\/([\w\-]{8,})(?!\.)/gi,
        replaceReg: /(?:https?:\/\/)?wss1.cn\/f\/([\w\-]{8,})(?!\.)/gi,
        prefix: "https://t.wss.ink/f/",
        checkFun: (shareId, callback) => {
          logger.info("Wenshushu check id " + shareId);
          http.ajax({
            type: "post",
            url: "https://www.wenshushu.cn/ap/task/mgrtask",
            data: JSON.stringify({
              tid: shareId
            }),
            headers: {
              "Content-Type": "application/json",
              "x-token": "wss:7pmakczzw6i"
            },
            dataType: "json",
            success: (response) => {
              logger.debug("Wenshushu check response", response);
              let state = 1;
              if (!response) {
                state = 0;
              } else if (response.code != 0) {
                state = -1;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      pan115: {
        reg: /(?:h?ttps?:\/\/)?(?:www\.)?\b(?:115|anxia|115cdn)\.com\/s\/([\w\-]{8,})(?!\.)/gi,
        replaceReg: /(?:h?ttps?:\/\/)?(?:www\.)?(?:115|anxia|115cdn)\.com\/s\/([\w\-]{8,})(?!\.)/gi,
        prefix: "https://115cdn.com/s/",
        checkFun: (shareId, callback) => {
          logger.info("Pan115 check id " + shareId);
          shareId = shareId.replace("https://115cdn.com/s/", "");
          http.ajax({
            type: "get",
            url: "https://115cdn.com/webapi/share/snap?share_code=" + shareId + "&receive_code=",
            success: (response) => {
              logger.debug("Pan115 check response", response);
              let rsp = typeof response == "string" ? JSON.parse(response) : response;
              let state = 0;
              if (!response) {
                state = 0;
              } else if (rsp.state) {
                state = 1;
              } else if (rsp.error && rsp.error.includes("访问码")) {
                state = 2;
              } else if (rsp.error && (rsp.error.includes("不存在或已被删除") || rsp.error.includes("分享已取消"))) {
                state = -1;
              }
              callback && callback({ state });
            },
            error: function() {
              callback && callback({ state: 0 });
            }
          });
        }
      },
      // B站视频检测
      bilibili: {
        reg: /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[\w\d]+|av\d+)/i,
        replaceReg: /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[\w\d]+|av\d+)/i,
        prefix: "https://www.bilibili.com/video/",
        checkFun: (videoId, callback) => {
          logger.info("🔍 B站视频检测开始:", videoId);
          let url = videoId;
          if (!videoId.includes("http")) {
            url = videoId.startsWith("BV") || videoId.startsWith("av") ? `https://www.bilibili.com/video/${videoId}` : `https://www.bilibili.com/video/${videoId}`;
          }
          logger.info("📡 请求URL:", url);
          http.ajax({
            type: "GET",
            url,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
            },
            timeout: 1e4,
            success: (response) => {
              logger.info("B站视频响应:", {
                videoId,
                responseLength: response ? response.length : 0,
                responseType: typeof response
              });
              let state = 1;
              if (!response || typeof response !== "string") {
                state = 0;
                logger.warn("B站视频无响应或响应格式错误");
              } else {
                const isVideoMissing = response.includes("视频不见了") || response.includes("视频内容已被UP主删除") || response.includes("视频无法观看") || response.includes("啥都木有") || response.includes("页面不存在");
                if (isVideoMissing) {
                  state = -1;
                  logger.warn("B站视频失效:", videoId);
                } else {
                  state = 1;
                  logger.info("B站视频有效:", videoId);
                }
              }
              const result = { state };
              logger.info("B站视频检测结果:", result);
              callback && callback(result);
            },
            error: function(error2) {
              logger.error("💥 B站视频请求失败:", error2);
              callback && callback({ state: 0 });
            }
          });
        }
      }
    };
    class LinkChecker {
      constructor() {
        this.checkCache = /* @__PURE__ */ new Map();
        this.cacheTimeout = 5 * 60 * 1e3;
      }
      /**
       * 识别链接类型和提取分享ID
       * @param {string} url - 链接URL
       * @returns {object|null} - {type, shareId} 或 null
       */
      identifyLink(url) {
        if (!url || typeof url !== "string") return null;
        for (const [type, config] of Object.entries(constant)) {
          config.reg.lastIndex = 0;
          const match = config.reg.exec(url);
          if (match) {
            return {
              type,
              shareId: match[2] || match[1],
              // 提取分享ID
              url
            };
          }
        }
        return null;
      }
      /**
       * 检测链接状态
       * @param {string} url - 链接URL
       * @param {function} callback - 回调函数
       * @returns {Promise} - 检测结果
       */
      async checkLink(url, callback) {
        logger.info("开始检测链接:", url);
        const linkInfo = this.identifyLink(url);
        if (!linkInfo) {
          const result = { state: 0, message: "不支持的链接类型" };
          logger.warn("不支持的链接类型:", url);
          callback && callback(result);
          return result;
        }
        logger.info("识别链接信息:", linkInfo);
        const cacheKey = `${linkInfo.type}_${linkInfo.shareId}`;
        const cached = this.checkCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
          logger.info("使用缓存结果:", cacheKey, cached.result);
          callback && callback(cached.result);
          return cached.result;
        }
        return new Promise((resolve) => {
          const config = constant[linkInfo.type];
          if (!config || !config.checkFun) {
            const result = { state: 0, message: "检测功能未实现" };
            logger.error("检测功能未实现:", linkInfo.type);
            callback && callback(result);
            resolve(result);
            return;
          }
          logger.info("开始执行检测函数:", linkInfo.type, linkInfo.shareId);
          try {
            config.checkFun(linkInfo.shareId, (result) => {
              logger.info("检测函数回调:", {
                type: linkInfo.type,
                shareId: linkInfo.shareId,
                result
              });
              this.checkCache.set(cacheKey, {
                result,
                timestamp: Date.now()
              });
              logger.info("结果已缓存:", cacheKey);
              callback && callback(result);
              resolve(result);
            });
          } catch (error2) {
            logger.error("检测函数执行异常:", error2);
            const result = { state: 0, message: "检测异常: " + error2.message };
            callback && callback(result);
            resolve(result);
          }
        });
      }
      /**
       * 获取状态描述
       * @param {number} state - 状态值
       * @returns {object} - {text, class, color}
       */
      getStateInfo(state) {
        const stateMap = {
          1: { text: "有效", class: "success", color: "#52c41a" },
          2: { text: "有效", class: "warning", color: "#faad14" },
          0: { text: "检测中...", class: "loading", color: "#1890ff" },
          [-1]: { text: "失效", class: "error", color: "#ff4d4f" },
          11: { text: "部分违规", class: "partial", color: "#fa8c16" }
        };
        return stateMap[state] || { text: "未知", class: "unknown", color: "#d9d9d9" };
      }
      /**
       * 清除缓存
       */
      clearCache() {
        this.checkCache.clear();
      }
    }
    const linkChecker = new LinkChecker();
    const _hoisted_1$4 = { class: "link-manager" };
    const _hoisted_2$4 = {
      key: 0,
      class: "modal-overlay"
    };
    const _hoisted_3$4 = { class: "modal-content" };
    const _hoisted_4$4 = { class: "modal-header" };
    const _hoisted_5$3 = ["disabled"];
    const _hoisted_6$3 = { class: "modal-body" };
    const _hoisted_7$3 = { class: "form-row" };
    const _hoisted_8$3 = { class: "form-group" };
    const _hoisted_9$3 = { class: "input-wrapper" };
    const _hoisted_10$3 = { class: "form-group" };
    const _hoisted_11$3 = { class: "input-wrapper" };
    const _hoisted_12$3 = {
      key: 0,
      class: "url-preview"
    };
    const _hoisted_13$3 = { class: "url-preview-text" };
    const _hoisted_14$3 = { class: "form-row" };
    const _hoisted_15$3 = { class: "form-group" };
    const _hoisted_16$1 = { class: "form-row" };
    const _hoisted_17$1 = {
      key: 0,
      class: "form-group"
    };
    const _hoisted_18$1 = {
      key: 1,
      class: "form-group"
    };
    const _hoisted_19$1 = { class: "input-wrapper" };
    const _hoisted_20$1 = { class: "form-group" };
    const _hoisted_21$1 = { class: "input-wrapper" };
    const _hoisted_22$1 = { class: "form-row" };
    const _hoisted_23$1 = { class: "form-group" };
    const _hoisted_24$1 = { class: "input-wrapper" };
    const _hoisted_25$1 = {
      key: 0,
      class: "form-group"
    };
    const _hoisted_26$1 = { class: "checkbox-group" };
    const _hoisted_27$1 = {
      key: 0,
      class: "modal-overlay"
    };
    const _hoisted_28$1 = { class: "modal-content" };
    const _hoisted_29$1 = { class: "modal-header" };
    const _hoisted_30$1 = ["disabled"];
    const _hoisted_31$1 = { class: "modal-body" };
    const _hoisted_32$1 = { class: "form-row" };
    const _hoisted_33$1 = { class: "form-group" };
    const _hoisted_34$1 = { class: "input-wrapper" };
    const _hoisted_35$1 = { class: "form-group" };
    const _hoisted_36$1 = { class: "input-wrapper" };
    const _hoisted_37$1 = {
      key: 0,
      class: "url-preview"
    };
    const _hoisted_38$1 = { class: "url-preview-text" };
    const _hoisted_39$1 = { class: "form-row" };
    const _hoisted_40$1 = { class: "form-group" };
    const _hoisted_41$1 = { class: "form-row" };
    const _hoisted_42$1 = {
      key: 0,
      class: "form-group"
    };
    const _hoisted_43$1 = {
      key: 1,
      class: "form-group"
    };
    const _hoisted_44$1 = { class: "input-wrapper" };
    const _hoisted_45$1 = { class: "form-group" };
    const _hoisted_46$1 = { class: "input-wrapper" };
    const _hoisted_47$1 = { class: "form-row" };
    const _hoisted_48$1 = { class: "form-group" };
    const _hoisted_49$1 = { class: "input-wrapper" };
    const _hoisted_50$1 = {
      key: 0,
      class: "form-group"
    };
    const _hoisted_51$1 = { class: "checkbox-group" };
    const _hoisted_52$1 = { class: "links-section" };
    const _hoisted_53$1 = { class: "filter-bar" };
    const _hoisted_54$1 = { class: "filter-controls" };
    const _hoisted_55$1 = ["disabled"];
    const _hoisted_56 = {
      key: 0,
      class: "links-list"
    };
    const _hoisted_57 = {
      key: 1,
      class: "links-list"
    };
    const _hoisted_58 = {
      key: 2,
      class: "links-list"
    };
    const _hoisted_59 = ["onClick"];
    const _hoisted_60 = { class: "link-header" };
    const _hoisted_61 = {
      key: 0,
      class: "platform-badge"
    };
    const _hoisted_62 = ["src", "alt"];
    const _hoisted_63 = { class: "link-meta" };
    const _hoisted_64 = {
      key: 0,
      class: "language"
    };
    const _hoisted_65 = {
      key: 1,
      class: "file-size"
    };
    const _hoisted_66 = {
      key: 2,
      class: "feature-tags"
    };
    const _hoisted_67 = {
      key: 0,
      class: "feature-tag feature-4k"
    };
    const _hoisted_68 = {
      key: 1,
      class: "feature-tag feature-hdr"
    };
    const _hoisted_69 = {
      key: 2,
      class: "feature-tag feature-dolby"
    };
    const _hoisted_70 = {
      key: 3,
      class: "feature-tag feature-subtitle"
    };
    const _hoisted_71 = {
      key: 0,
      class: "feature-tag feature-flac"
    };
    const _hoisted_72 = {
      key: 1,
      class: "feature-tag feature-wav"
    };
    const _hoisted_73 = { class: "link-content" };
    const _hoisted_74 = { class: "link-title-row" };
    const _hoisted_75 = { class: "link-details" };
    const _hoisted_76 = ["title", "onContextmenu"];
    const _hoisted_77 = { class: "vote-section" };
    const _hoisted_78 = ["onClick", "disabled"];
    const _hoisted_79 = {
      viewBox: "0 0 100 100",
      class: "vote-icon",
      xmlns: "http://www.w3.org/2000/svg"
    };
    const _hoisted_80 = ["fill"];
    const _hoisted_81 = ["onClick", "disabled"];
    const _hoisted_82 = {
      viewBox: "0 0 100 100",
      class: "vote-icon down-icon",
      xmlns: "http://www.w3.org/2000/svg"
    };
    const _hoisted_83 = ["fill"];
    const _hoisted_84 = { class: "action-buttons" };
    const _hoisted_85 = ["onClick"];
    const _hoisted_86 = ["onClick"];
    const _hoisted_87 = ["onClick"];
    const _hoisted_88 = { class: "link-footer" };
    const _hoisted_89 = { class: "footer-left" };
    const _hoisted_90 = ["href"];
    const _hoisted_91 = { class: "author" };
    const _hoisted_92 = { class: "footer-right" };
    const _hoisted_93 = { class: "date" };
    const _hoisted_94 = {
      key: 3,
      class: "login-prompt"
    };
    const _hoisted_95 = {
      key: 4,
      class: "empty-state"
    };
    const _hoisted_96 = {
      key: 5,
      class: "seek-resource-section"
    };
    const _hoisted_97 = ["disabled"];
    const _hoisted_98 = {
      key: 0,
      class: "spinner"
    };
    const _hoisted_99 = { class: "seek-count" };
    const _hoisted_100 = {
      key: 0,
      class: "pagination"
    };
    const _hoisted_101 = ["disabled"];
    const _hoisted_102 = { class: "pagination-info" };
    const _hoisted_103 = ["disabled"];
    const _hoisted_104 = {
      key: 0,
      class: "modal-overlay"
    };
    const _hoisted_105 = { class: "modal-content" };
    const _hoisted_106 = { class: "modal-body" };
    const _hoisted_107 = { class: "form-actions" };
    const _hoisted_108 = ["disabled"];
    const _hoisted_109 = {
      key: 0,
      class: "modal-overlay"
    };
    const _hoisted_110 = { class: "modal-content" };
    const _hoisted_111 = { class: "modal-body" };
    const _hoisted_112 = { class: "form-group" };
    const _hoisted_113 = { class: "form-group" };
    const _hoisted_114 = { class: "input-wrapper" };
    const _hoisted_115 = { class: "form-actions" };
    const _hoisted_116 = ["disabled"];
    const DEBOUNCE_DELAY = 800;
    const DRAFT_KEY = "doubanflix_link_draft";
    const _sfc_main$4 = {
      __name: "LinkManager",
      props: {
        subjectId: {
          type: String,
          required: true
        },
        subjectCategory: {
          type: String,
          required: true,
          validator: (value) => ["movie", "albums", "books", "games"].includes(value)
        },
        linkType: {
          type: String,
          default: "all"
        }
      },
      emits: ["counts-updated"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const emit2 = __emit;
        const currentLinkType = computed(() => props.linkType);
        const voteApiLinkType = computed(() => {
          const categoryToLinkTypeMap = {
            "movies": "movie",
            "albums": "album",
            "books": "book",
            "games": "game"
          };
          return categoryToLinkTypeMap[props.subjectCategory] || "movie";
        });
        const allLinksData = ref({});
        const links = ref([]);
        const isLoading = ref(false);
        const isAuthInitializing = ref(false);
        const error2 = ref("");
        const successMessage = ref("");
        const showAddForm = ref(false);
        const showModifyForm = ref(false);
        const modifyingLink = ref(null);
        const isSubmitting = ref(false);
        const expandedItems = ref(/* @__PURE__ */ new Set());
        const seekerStats = ref({});
        const userSeekStatus = ref({});
        const isSeeking = ref(false);
        const linkCheckStatus = ref(/* @__PURE__ */ new Map());
        const checkingLinks = ref(/* @__PURE__ */ new Set());
        const pagination = ref({
          page: 1,
          limit: 5,
          total: 0,
          pages: 0
        });
        const newLink = reactive({
          linkType: "",
          platform: "",
          url: "",
          extractCode: "",
          title: "",
          size: "",
          original_url: "",
          // 电影相关字段
          has_4k: false,
          has_hdr: false,
          has_dolby_atmos: false,
          has_subtitles: false,
          // 音乐相关字段
          is_flac: false,
          is_wav: false
        });
        const modifyLink = reactive({
          id: "",
          linkType: "",
          platform: "",
          url: "",
          extractCode: "",
          title: "",
          size: "",
          original_url: "",
          // 电影相关字段
          has_4k: false,
          has_hdr: false,
          has_dolby_atmos: false,
          has_subtitles: false,
          // 音乐相关字段
          is_flac: false,
          is_wav: false
        });
        const isInitializing = ref(false);
        const savedSort = storageHelper.getSortPreference();
        const savedPlatform = storageHelper.getPlatformPreference();
        const initialSort = savedSort === "likes" || !savedSort ? "likes_count" : savedSort;
        const filter = reactive({
          platform: props.linkType === "netdisk" ? savedPlatform : "",
          sortBy: initialSort
        });
        watch(() => filter.sortBy, (newVal) => {
          storageHelper.setSortPreference(newVal);
        });
        watch(() => filter.platform, (newVal) => {
          if (props.linkType === "netdisk") {
            storageHelper.setPlatformPreference(newVal);
          }
        });
        const linkTypeOptions = [
          { value: "", label: "请选择类型" },
          { value: "netdisk", label: "网盘" },
          { value: "magnet", label: "BT" },
          { value: "online", label: "在线" }
        ];
        const netdiskPlatformOptions = [
          { value: "", label: "请选择平台" },
          { value: "quark", label: "夸克网盘" },
          { value: "ali", label: "阿里云盘" },
          { value: "baidu", label: "百度网盘" },
          { value: "tianyi", label: "天翼云盘" },
          { value: "mobile", label: "移动云盘" },
          { value: "115", label: "115网盘" },
          { value: "xunlei", label: "迅雷网盘" },
          { value: "uc", label: "UC网盘" },
          { value: "123", label: "123网盘" },
          { value: "lanzou", label: "蓝奏网盘" }
        ];
        watch(() => newLink.url, (newUrl, oldUrl) => {
          if (newUrl && newUrl.trim()) {
            const newCleanedUrl = cleanUrl(newUrl.trim());
            if (newCleanedUrl === cleanedNewUrl.value) {
              return;
            }
            cleanedNewUrl.value = newCleanedUrl;
            const autoFillData = autoFillFormData(newUrl.trim());
            if (autoFillData.isValid) {
              if (autoFillData.linkType === "bt") {
                autoFillData.linkType = "magnet";
              }
              newLink.linkType = autoFillData.linkType;
              newLink.platform = autoFillData.platform;
              newLink.extractCode = autoFillData.extractCode;
            }
          } else if (!newUrl || newUrl.trim() === "") {
            cleanedNewUrl.value = "";
            newLink.linkType = "";
            newLink.platform = "";
            newLink.extractCode = "";
          }
        });
        watch(() => modifyLink.url, (newUrl, oldUrl) => {
          if (newUrl === oldUrl) {
            return;
          }
          if (isInitializing.value) {
            return;
          }
          if (newUrl && newUrl.trim()) {
            const newCleanedUrl = cleanUrl(newUrl.trim());
            if (newCleanedUrl === cleanedModifyUrl.value) {
              return;
            }
            cleanedModifyUrl.value = newCleanedUrl;
            const autoFillData = autoFillFormData(newUrl.trim());
            if (autoFillData.isValid) {
              if (autoFillData.linkType === "bt") {
                autoFillData.linkType = "magnet";
              }
              modifyLink.linkType = autoFillData.linkType;
              modifyLink.platform = autoFillData.platform;
              modifyLink.extractCode = autoFillData.extractCode;
            }
          } else if (!newUrl || newUrl.trim() === "") {
            cleanedModifyUrl.value = "";
            modifyLink.linkType = "";
            modifyLink.platform = "";
            modifyLink.extractCode = "";
          }
        });
        watch(() => newLink.title, (newTitle) => {
          if (newTitle && newTitle.trim()) {
            const features = detectFeaturesFromTitle(newTitle.trim());
            if (props.subjectCategory === "movies") {
              newLink.has_4k = features.has_4k;
              newLink.has_hdr = features.has_hdr;
              newLink.has_dolby_atmos = features.has_dolby_atmos;
            } else if (props.subjectCategory === "albums") {
              newLink.is_flac = features.is_flac;
              newLink.is_wav = features.is_wav;
            }
            if (features.file_size && !newLink.size) {
              newLink.size = features.file_size;
            }
          }
        });
        watch(() => modifyLink.title, (newTitle) => {
          if (isInitializing.value) {
            return;
          }
          if (newTitle && newTitle.trim()) {
            const features = detectFeaturesFromTitle(newTitle.trim());
            if (props.subjectCategory === "movies") {
              modifyLink.has_4k = features.has_4k;
              modifyLink.has_hdr = features.has_hdr;
              modifyLink.has_dolby_atmos = features.has_dolby_atmos;
            } else if (props.subjectCategory === "albums") {
              modifyLink.is_flac = features.is_flac;
              modifyLink.is_wav = features.is_wav;
            }
            if (features.file_size && !modifyLink.size) {
              modifyLink.size = features.file_size;
            }
          }
        });
        const sortOptions = [
          { value: "created_at", label: "按时间" },
          { value: "likes_count", label: "按点赞数" },
          { value: "like_rate", label: "按点赞率" }
        ];
        const currentPlatformOptions = computed(() => {
          const linkType = showModifyForm.value ? modifyLink.linkType : newLink.linkType;
          switch (linkType) {
            case "netdisk":
              return netdiskPlatformOptions;
            default:
              return [{ value: "", label: "请选择平台" }];
          }
        });
        const filterPlatformOptions = computed(() => {
          const baseOptions = [{ value: "", label: "所有平台" }];
          switch (props.linkType) {
            case "netdisk":
              return baseOptions.concat([
                { value: "quark", label: "夸克" },
                { value: "ali", label: "阿里" },
                { value: "baidu", label: "百度" },
                { value: "tianyi", label: "天翼" },
                { value: "mobile", label: "移动" },
                { value: "115", label: "115" },
                { value: "xunlei", label: "迅雷" },
                { value: "uc", label: "UC" },
                { value: "123", label: "123" },
                { value: "lanzou", label: "蓝奏" }
              ]);
            default:
              return baseOptions;
          }
        });
        const isAuthenticated2 = computed(() => userStore$1.isAuthenticated.value);
        const cleanedNewUrl = ref("");
        const cleanedModifyUrl = ref("");
        const currentSeekKey = computed(() => {
          if (currentLinkType.value === "netdisk") {
            return filter.platform || "any";
          }
          return currentLinkType.value;
        });
        const applyLocalFilters = (page = 1) => {
          let filteredLinks = [];
          if (props.linkType === "all") {
            Object.values(allLinksData.value).forEach((arr) => {
              if (Array.isArray(arr)) {
                filteredLinks = filteredLinks.concat(arr);
              }
            });
          } else {
            let typeKey = props.linkType;
            if (typeKey === "bt") typeKey = "magnet";
            if (allLinksData.value[typeKey] && Array.isArray(allLinksData.value[typeKey])) {
              filteredLinks = allLinksData.value[typeKey];
            }
          }
          if (filter.platform) {
            filteredLinks = filteredLinks.filter((link) => link.platform === filter.platform);
          }
          const sortBy = filter.sortBy || "created_at";
          filteredLinks.sort((a, b) => {
            let valA, valB;
            if (sortBy === "created_at") {
              valA = new Date(a.created_at).getTime();
              valB = new Date(b.created_at).getTime();
            } else if (sortBy === "likes_count") {
              valA = a.up_votes || 0;
              valB = b.up_votes || 0;
            } else if (sortBy === "like_rate") {
              if (a.like_rate !== void 0) {
                valA = a.like_rate;
              } else {
                const totalA = (a.up_votes || 0) + (a.down_votes || 0);
                valA = totalA === 0 ? 0 : (a.up_votes || 0) / totalA;
              }
              if (b.like_rate !== void 0) {
                valB = b.like_rate;
              } else {
                const totalB = (b.up_votes || 0) + (b.down_votes || 0);
                valB = totalB === 0 ? 0 : (b.up_votes || 0) / totalB;
              }
            } else {
              valA = a[sortBy];
              valB = b[sortBy];
            }
            if (valA < valB) return 1;
            if (valA > valB) return -1;
            return 0;
          });
          const limit = pagination.value.limit || 5;
          const total = filteredLinks.length;
          const pages = Math.ceil(total / limit) || 1;
          const currentPage = total > 0 ? Math.min(Math.max(1, page), pages) : 1;
          const start = (currentPage - 1) * limit;
          const end = start + limit;
          links.value = filteredLinks.slice(start, end);
          pagination.value = {
            page: currentPage,
            limit,
            total,
            pages
          };
        };
        const loadLinks = async (page = 1, forceRefresh = false) => {
          if (!props.subjectId) return;
          if (!userStore$1.initialized.value) {
            isAuthInitializing.value = true;
            await userStore$1.initAuth();
            isAuthInitializing.value = false;
          }
          if (!isAuthenticated2.value) {
            links.value = [];
            pagination.value = {
              page: 1,
              limit: 5,
              total: 0,
              pages: 0
            };
            isLoading.value = false;
            error2.value = "";
            return;
          }
          const hasData = Object.keys(allLinksData.value).length > 0;
          const shouldFetch = forceRefresh || !hasData;
          if (shouldFetch) {
            if (isLoading.value) return;
            isLoading.value = true;
            error2.value = "";
            try {
              const result = await LinkService.getAllLinks(props.subjectId, props.subjectCategory);
              if (result.success) {
                allLinksData.value = result.data || {};
                seekerStats.value = result.seekerStats || {};
                userSeekStatus.value = result.userSeekStatus || {};
                const counts = {
                  netdisk: (allLinksData.value.netdisk || []).length,
                  bt: (allLinksData.value.magnet || []).length,
                  online: (allLinksData.value.online || []).length
                };
                emit2("counts-updated", counts);
              } else {
                if (result.error && (result.error.includes("电影不存在") || result.error.includes("主题不存在"))) {
                  console.log("主题不存在，静默处理");
                  allLinksData.value = {};
                } else if (result.error && (result.error.includes("请先登录") || result.error.includes("登录已过期"))) {
                  console.log("认证错误，静默处理:", result.error);
                  throw new Error(result.error);
                } else {
                  throw new Error(result.error);
                }
              }
            } catch (err) {
              if (err.message && (err.message.includes("电影不存在") || err.message.includes("主题不存在"))) {
                console.log("主题不存在，静默处理");
                links.value = [];
                pagination.value = {
                  page: 1,
                  limit: 5,
                  total: 0,
                  pages: 0
                };
              } else if (err.message && (err.message.includes("请先登录") || err.message.includes("登录已过期"))) {
                console.log("认证错误，静默处理:", err.message);
              } else {
                error2.value = "加载链接失败";
                console.error("加载链接错误:", err);
              }
            } finally {
              isLoading.value = false;
            }
          }
          applyLocalFilters(page);
        };
        const handleAddLink = async () => {
          if (!isAuthenticated2.value) {
            return;
          }
          isSubmitting.value = true;
          error2.value = "";
          try {
            let processedOriginalUrl = newLink.original_url ? newLink.original_url.trim() : "";
            if (processedOriginalUrl && !/^https?:\/\//i.test(processedOriginalUrl)) {
              processedOriginalUrl = "https://" + processedOriginalUrl;
            }
            const result = await LinkService.addLink({
              subjectId: props.subjectId,
              category: props.subjectCategory,
              linkType: newLink.linkType,
              platform: newLink.platform,
              url: cleanedNewUrl.value || newLink.url,
              // 使用识别后的URL，如果为空则使用原始URL
              extractCode: newLink.extractCode,
              title: newLink.title,
              size: newLink.size,
              original_url: processedOriginalUrl,
              has_4k: newLink.has_4k,
              has_hdr: newLink.has_hdr,
              has_dolby_atmos: newLink.has_dolby_atmos,
              has_subtitles: newLink.has_subtitles,
              is_flac: newLink.is_flac,
              is_wav: newLink.is_wav
            });
            if (result.success) {
              successMessage.value = result.message;
              resetForm();
              clearDraft();
              showAddForm.value = false;
              await loadLinks(1, true);
              setTimeout(() => {
                successMessage.value = "";
              }, 3e3);
            } else {
              if (result.error && (result.error.includes("请先登录") || result.error.includes("登录已过期"))) {
                console.log("认证错误，静默处理:", result.error);
              } else {
                error2.value = result.error;
              }
            }
          } catch (err) {
            if (err.message && (err.message.includes("请先登录") || err.message.includes("登录已过期"))) {
              console.log("认证错误，静默处理:", err.message);
            } else {
              error2.value = "添加链接失败";
              console.error("添加链接错误:", err);
            }
          } finally {
            isSubmitting.value = false;
          }
        };
        const voteDebounceTimers = ref(/* @__PURE__ */ new Map());
        const pendingVotes = ref(/* @__PURE__ */ new Map());
        const executingVotes = ref(/* @__PURE__ */ new Map());
        const handleVote = async (linkId, voteType) => {
          if (!isAuthenticated2.value) {
            return;
          }
          const link = links.value.find((l) => l.id === linkId);
          if (!link) return;
          if (voteDebounceTimers.value.has(linkId)) {
            clearTimeout(voteDebounceTimers.value.get(linkId));
          }
          if (executingVotes.value.has(linkId)) {
            const executingVote = executingVotes.value.get(linkId);
            executingVote.cancelled = true;
            console.log("取消上一次正在执行的投票操作:", linkId);
          }
          if (!pendingVotes.value.has(linkId)) {
            pendingVotes.value.set(linkId, {
              originalUserVote: link.user_vote_type,
              originalUpVotes: link.up_votes || 0,
              originalDownVotes: link.down_votes || 0,
              clickSequence: [],
              // 记录点击序列
              link
            });
          }
          const pendingVote = pendingVotes.value.get(linkId);
          pendingVote.clickSequence.push({
            voteType,
            timestamp: Date.now()
          });
          const finalIntention = analyzeFinalIntention(pendingVote.originalUserVote, pendingVote.clickSequence);
          let newUpVotes = pendingVote.originalUpVotes;
          let newDownVotes = pendingVote.originalDownVotes;
          if (pendingVote.originalUserVote === "up") {
            if (finalIntention === null) {
              newUpVotes = Math.max(0, pendingVote.originalUpVotes - 1);
            } else if (finalIntention === "down") {
              newUpVotes = Math.max(0, pendingVote.originalUpVotes - 1);
              newDownVotes = pendingVote.originalDownVotes + 1;
            } else {
              newUpVotes = pendingVote.originalUpVotes;
            }
          } else if (pendingVote.originalUserVote === "down") {
            if (finalIntention === null) {
              newDownVotes = Math.max(0, pendingVote.originalDownVotes - 1);
            } else if (finalIntention === "up") {
              newDownVotes = Math.max(0, pendingVote.originalDownVotes - 1);
              newUpVotes = pendingVote.originalUpVotes + 1;
            } else {
              newDownVotes = pendingVote.originalDownVotes;
            }
          } else {
            if (finalIntention === "up") {
              newUpVotes = pendingVote.originalUpVotes + 1;
            } else if (finalIntention === "down") {
              newDownVotes = pendingVote.originalDownVotes + 1;
            }
          }
          link.user_vote_type = finalIntention;
          link.up_votes = newUpVotes;
          link.down_votes = newDownVotes;
          const timerId = setTimeout(async () => {
            const pendingVote2 = pendingVotes.value.get(linkId);
            if (!pendingVote2) return;
            const executionContext = {
              cancelled: false,
              linkId,
              timestamp: Date.now()
            };
            executingVotes.value.set(linkId, executionContext);
            voteDebounceTimers.value.delete(linkId);
            pendingVotes.value.delete(linkId);
            await executeVoteRequest(pendingVote2, executionContext);
            if (executingVotes.value.get(linkId) === executionContext) {
              executingVotes.value.delete(linkId);
            }
          }, DEBOUNCE_DELAY);
          voteDebounceTimers.value.set(linkId, timerId);
        };
        const executeVoteRequest = async (pendingVote, executionContext) => {
          const { originalUserVote, originalUpVotes, originalDownVotes, clickSequence, link } = pendingVote;
          const linkId = link.id;
          if (executionContext && executionContext.cancelled) {
            console.log("投票操作已被取消，跳过API请求:", linkId);
            return;
          }
          const finalIntention = analyzeFinalIntention(originalUserVote, clickSequence);
          console.log("分析用户投票意图:", {
            linkId,
            originalUserVote,
            clickSequence: clickSequence.map((c) => c.voteType),
            finalIntention,
            currentUIState: link.user_vote_type,
            executionId: executionContext == null ? void 0 : executionContext.timestamp
          });
          if (finalIntention === originalUserVote) {
            console.log("用户最终意图与原始状态相同，跳过API请求");
            return;
          }
          try {
            if (executionContext && executionContext.cancelled) {
              console.log("API请求前检查：投票操作已被取消:", linkId);
              return;
            }
            let result;
            if (finalIntention === null) {
              result = await LinkService.removeVote(linkId, originalUpVotes, originalDownVotes, originalUserVote, voteApiLinkType.value);
            } else {
              result = await LinkService.voteLink(linkId, finalIntention, voteApiLinkType.value);
            }
            if (executionContext && executionContext.cancelled) {
              console.log("API请求完成后检查：投票操作已被取消，忽略结果:", linkId);
              return;
            }
            if (!result.success) {
              link.user_vote_type = originalUserVote;
              link.up_votes = originalUpVotes;
              link.down_votes = originalDownVotes;
              if (result.error && (result.error.includes("请先登录") || result.error.includes("登录已过期"))) {
                console.log("认证错误，静默处理:", result.error);
              } else {
                error2.value = result.error;
              }
            } else {
              if (result.data) {
                link.user_vote_type = result.data.user_vote_type;
                link.up_votes = result.data.up_votes || 0;
                link.down_votes = result.data.down_votes || 0;
              }
            }
          } catch (err) {
            if (executionContext && executionContext.cancelled) {
              console.log("异常处理中检查：投票操作已被取消，忽略错误:", linkId);
              return;
            }
            link.user_vote_type = originalUserVote;
            link.up_votes = originalUpVotes;
            link.down_votes = originalDownVotes;
            if (err.message && (err.message.includes("请先登录") || err.message.includes("登录已过期"))) {
              console.log("认证错误，静默处理:", err.message);
            } else {
              error2.value = "投票操作失败";
              console.error("投票请求错误:", err);
            }
          }
        };
        const analyzeFinalIntention = (originalUserVote, clickSequence) => {
          if (clickSequence.length === 0) {
            return originalUserVote;
          }
          let currentState = originalUserVote;
          for (const click of clickSequence) {
            const { voteType } = click;
            if (currentState === voteType) {
              currentState = null;
            } else {
              currentState = voteType;
            }
          }
          return currentState;
        };
        const handleDeleteLink = async (link) => {
          deletingLinkId.value = link.id;
          deletingSubjectId.value = link.subject_id || link.movie_id;
          showDeleteModal.value = true;
        };
        const closeDeleteModal = () => {
          showDeleteModal.value = false;
          deletingLinkId.value = "";
          deletingSubjectId.value = "";
          isDeleting.value = false;
        };
        const confirmDeleteLink = async () => {
          if (!deletingLinkId.value || !deletingSubjectId.value) return;
          try {
            isDeleting.value = true;
            const result = await LinkService.deleteLink(deletingSubjectId.value, deletingLinkId.value, props.subjectCategory);
            if (result.success) {
              successMessage.value = result.message;
              closeDeleteModal();
              await loadLinks();
              setTimeout(() => {
                successMessage.value = "";
              }, 3e3);
            } else {
              if (result.error && (result.error.includes("请先登录") || result.error.includes("登录已过期"))) {
                console.log("认证错误，静默处理:", result.error);
              } else {
                error2.value = result.error;
              }
            }
          } catch (err) {
            if (err.message && (err.message.includes("请先登录") || err.message.includes("登录已过期"))) {
              console.log("认证错误，静默处理:", err.message);
            } else {
              error2.value = "删除链接失败";
              console.error("删除链接错误:", err);
            }
          } finally {
            isDeleting.value = false;
          }
        };
        const handleSeekResource = async () => {
          var _a;
          if (isSeeking.value) return;
          try {
            isSeeking.value = true;
            const seekData = {
              subject_id: props.subjectId,
              subject_type: props.subjectCategory,
              seek_type: currentLinkType.value,
              // 'netdisk', 'bt' 等
              platform: currentLinkType.value === "netdisk" && filter.platform ? filter.platform : "any"
            };
            const result = await LinkService.seekResource(seekData);
            if (result.success) {
              successMessage.value = "求资源请求发送成功";
              const statsKey = result.stats_key || ((_a = result.data) == null ? void 0 : _a.stats_key) || seekData.platform || currentLinkType.value;
              userSeekStatus.value = {
                ...userSeekStatus.value,
                [statsKey]: true
              };
              const currentCount = seekerStats.value[statsKey] || 0;
              seekerStats.value = {
                ...seekerStats.value,
                [statsKey]: currentCount + 1
              };
              setTimeout(() => {
                successMessage.value = "";
              }, 3e3);
            } else {
              error2.value = result.error || "发送请求失败";
            }
          } catch (err) {
            console.error("求资源错误:", err);
            error2.value = "发送请求失败";
          } finally {
            isSeeking.value = false;
          }
        };
        const resetForm = () => {
          Object.assign(newLink, {
            linkType: "",
            platform: "",
            url: "",
            extractCode: "",
            title: "",
            size: "",
            original_url: "",
            has_4k: false,
            has_hdr: false,
            has_dolby_atmos: false,
            has_subtitles: false,
            is_flac: false,
            is_wav: false
          });
          cleanedNewUrl.value = "";
        };
        const showDeleteModal = ref(false);
        const deletingLinkId = ref("");
        const deletingSubjectId = ref("");
        const isDeleting = ref(false);
        const showReportModal = ref(false);
        const reportForm = reactive({
          linkId: "",
          type: "",
          reason: ""
        });
        const isSubmittingReport = ref(false);
        const reportReasons = [
          { value: "invalid_link", label: "无效链接" },
          { value: "copyright_issue", label: "版权问题" },
          { value: "malicious_link", label: "恶意链接" },
          { value: "spam", label: "垃圾信息" },
          { value: "fake_content", label: "虚假内容" },
          { value: "other", label: "其他" }
        ];
        const showReportForm = (linkId) => {
          if (!isAuthenticated2.value) {
            return;
          }
          reportForm.linkId = linkId;
          reportForm.type = "invalid_link";
          reportForm.reason = "";
          showReportModal.value = true;
        };
        const handleReportSubmit = async () => {
          if (!reportForm.type) {
            if (isAuthenticated2.value) {
              error2.value = "请选择反馈类型";
            }
            return;
          }
          isSubmittingReport.value = true;
          error2.value = "";
          try {
            const result = await LinkService.reportLink(
              reportForm.linkId,
              reportForm.type,
              reportForm.reason,
              voteApiLinkType.value
            );
            if (result.success) {
              successMessage.value = result.message;
              showReportModal.value = false;
              const linkInView = links.value.find((l) => l.id === reportForm.linkId);
              if (linkInView) {
                linkInView.report_count = (linkInView.report_count || 0) + 1;
              } else {
                Object.keys(allLinksData.value).forEach((key) => {
                  const list = allLinksData.value[key];
                  if (Array.isArray(list)) {
                    const targetLink = list.find((l) => l.id === reportForm.linkId);
                    if (targetLink) {
                      targetLink.report_count = (targetLink.report_count || 0) + 1;
                    }
                  }
                });
              }
              setTimeout(() => {
                successMessage.value = "";
              }, 3e3);
            } else {
              if (result.error && (result.error.includes("请先登录") || result.error.includes("登录已过期"))) {
                console.log("认证错误，静默处理:", result.error);
              } else {
                error2.value = result.error;
              }
            }
          } catch (err) {
            if (err.message && (err.message.includes("请先登录") || err.message.includes("登录已过期"))) {
              console.log("认证错误，静默处理:", err.message);
            } else {
              error2.value = "反馈提交失败";
              console.error("反馈错误:", err);
            }
          } finally {
            isSubmittingReport.value = false;
          }
        };
        const closeReportModal = () => {
          showReportModal.value = false;
          reportForm.linkId = "";
          reportForm.reason = "";
          reportForm.description = "";
        };
        const saveDraft = () => {
          const draft = {
            linkType: newLink.linkType,
            platform: newLink.platform,
            url: newLink.url,
            extractCode: newLink.extractCode,
            title: newLink.title,
            language: newLink.language,
            has_4k: newLink.has_4k,
            has_hdr: newLink.has_hdr,
            has_dolby_atmos: newLink.has_dolby_atmos,
            has_subtitles: newLink.has_subtitles,
            timestamp: Date.now()
          };
          const hasContent = Object.values(draft).some(
            (value) => value && value !== "" && typeof value !== "number"
          );
          if (hasContent) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
          }
        };
        const loadDraft = () => {
          try {
            const draftStr = localStorage.getItem(DRAFT_KEY);
            if (draftStr) {
              const draft = JSON.parse(draftStr);
              const isExpired = Date.now() - draft.timestamp > 24 * 60 * 60 * 1e3;
              if (!isExpired) {
                Object.assign(newLink, {
                  linkType: draft.linkType || "",
                  platform: draft.platform || "",
                  url: draft.url || "",
                  extractCode: draft.extractCode || "",
                  title: draft.title || "",
                  language: draft.language || "",
                  has_4k: draft.has_4k || false,
                  has_hdr: draft.has_hdr || false,
                  has_dolby_atmos: draft.has_dolby_atmos || false,
                  has_subtitles: draft.has_subtitles || false
                });
                return true;
              } else {
                localStorage.removeItem(DRAFT_KEY);
              }
            }
          } catch (err) {
            console.error("恢复草稿失败:", err);
            localStorage.removeItem(DRAFT_KEY);
          }
          return false;
        };
        const clearDraft = () => {
          localStorage.removeItem(DRAFT_KEY);
        };
        const openAddForm = () => {
          showAddForm.value = true;
          const hasDraft = loadDraft();
          if (hasDraft) {
            console.log("已恢复草稿内容");
          }
        };
        const closeModal = () => {
          saveDraft();
          showAddForm.value = false;
          resetForm();
        };
        const closeModifyModal = () => {
          showModifyForm.value = false;
          modifyingLink.value = null;
          resetModifyForm();
        };
        const openModifyForm = (link) => {
          modifyingLink.value = link;
          isInitializing.value = true;
          modifyLink.id = link.id;
          modifyLink.linkType = link.type;
          modifyLink.platform = link.platform || "";
          modifyLink.url = link.url;
          modifyLink.extractCode = link.password || "";
          modifyLink.title = link.title || "";
          modifyLink.size = link.size || "";
          modifyLink.original_url = link.original_url || "";
          modifyLink.has_4k = link.has_4k || false;
          modifyLink.has_hdr = link.has_hdr || false;
          modifyLink.has_dolby_atmos = link.has_dolby_atmos || false;
          modifyLink.has_subtitles = link.has_subtitles || false;
          modifyLink.is_flac = link.is_flac || false;
          modifyLink.is_wav = link.is_wav || false;
          if (modifyLink.url && modifyLink.url.trim()) {
            cleanedModifyUrl.value = cleanUrl(modifyLink.url.trim());
          } else {
            cleanedModifyUrl.value = "";
          }
          showModifyForm.value = true;
          nextTick(() => {
            isInitializing.value = false;
            if (modifyLink.url && modifyLink.url.trim() && (!modifyLink.linkType || !modifyLink.platform)) {
              const autoFillData = autoFillFormData(modifyLink.url.trim());
              if (autoFillData.isValid) {
                if (autoFillData.linkType === "bt") {
                  autoFillData.linkType = "magnet";
                }
                modifyLink.linkType = autoFillData.linkType;
                modifyLink.platform = autoFillData.platform;
                if (!modifyLink.extractCode && autoFillData.extractCode) {
                  modifyLink.extractCode = autoFillData.extractCode;
                }
              }
            }
          });
        };
        const resetModifyForm = () => {
          modifyLink.id = "";
          modifyLink.linkType = "";
          modifyLink.platform = "";
          modifyLink.extractCode = "";
          modifyLink.title = "";
          modifyLink.size = "";
          modifyLink.original_url = "";
          modifyLink.has_4k = false;
          modifyLink.has_hdr = false;
          modifyLink.has_dolby_atmos = false;
          modifyLink.has_subtitles = false;
          modifyLink.is_flac = false;
          modifyLink.is_wav = false;
          cleanedModifyUrl.value = "";
        };
        const handleModifyLink = async () => {
          if (isSubmitting.value) return;
          try {
            isSubmitting.value = true;
            error2.value = "";
            const linkData = { ...modifyLink };
            if (cleanedModifyUrl.value && cleanedModifyUrl.value.trim()) {
              linkData.url = cleanedModifyUrl.value.trim();
            }
            if (linkData.original_url && !/^https?:\/\//i.test(linkData.original_url.trim())) {
              linkData.original_url = "https://" + linkData.original_url.trim();
            } else if (linkData.original_url) {
              linkData.original_url = linkData.original_url.trim();
            }
            const result = await LinkService.updateLink(linkData.id, linkData, props.subjectId, props.subjectCategory);
            if (result.success) {
              successMessage.value = result.message;
              closeModifyModal();
              await loadLinks(pagination.value.page, true);
              setTimeout(() => {
                successMessage.value = "";
              }, 3e3);
            } else {
              if (result.error && (result.error.includes("请先登录") || result.error.includes("登录已过期"))) {
                console.log("认证错误，静默处理:", result.error);
              } else {
                error2.value = result.error;
              }
            }
          } catch (err) {
            console.error("修改链接失败:", err);
            if (err.message && (err.message.includes("请先登录") || err.message.includes("登录已过期"))) {
              console.log("认证错误，静默处理:", err.message);
            } else {
              error2.value = err.message || "修改链接失败";
            }
          } finally {
            isSubmitting.value = false;
          }
        };
        const canEditLink = (link) => {
          if (link.hasOwnProperty("is_owner")) {
            return isAuthenticated2.value && link.is_owner;
          }
          return isAuthenticated2.value && userStore$1.userId.value === link.user_id;
        };
        const getBilibiliPlatform = (url) => {
          if (!url) return null;
          try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes("bilibili.com")) {
              return "bilibili";
            }
          } catch (e) {
          }
          return null;
        };
        const getPlatformText = (platform) => {
          const platforms = {
            quark: "夸克",
            ali: "阿里",
            baidu: "百度",
            tianyi: "天翼",
            mobile: "移动",
            "115": "115",
            xunlei: "迅雷",
            uc: "UC",
            "123": "123",
            "lanzou": "蓝奏",
            bilibili: "B站",
            iqiyi: "爱奇艺",
            youku: "优酷",
            tencent: "腾讯",
            bt: "磁力"
          };
          return platforms[platform] || platform;
        };
        const getPlatformIcon = (platform) => {
          const icons = {
            quark: "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1756540462038" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4774" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M469.134884 976.133953c-110.258605-9.763721-215.516279-59.534884-290.768372-137.168372-75.490233-78.109767-113.830698-154.552558-132.167442-263.858604-4.762791-28.338605-5.477209-95.970233-1.190698-123.832558 10.24-68.822326 33.101395-134.072558 64.297675-184.32 88.349767-142.407442 236.710698-226.470698 399.598139-226.470698 69.536744 0 132.167442 12.621395 192.416744 39.054884 52.628837 23.099535 110.496744 64.297674 149.313489 106.448372 60.725581 65.964651 91.92186 122.165581 114.783255 206.943256 18.098605 66.917209 18.574884 160.982326 1.428838 227.423255-19.289302 73.585116-45.484651 126.213953-92.636279 184.55814-40.96 50.96186-84.063256 86.92093-140.740466 117.402791-59.534884 32.148837-114.545116 48.104186-184.08186 53.819534-34.053953 2.857674-47.151628 2.857674-80.253023 0z m84.063256-238.615813c11.668837-5.00093 20.71814-19.051163 20.718139-32.625117 0-23.337674 4.524651-49.771163 10.47814-61.44 12.145116-23.813953 28.338605-32.148837 77.395348-39.769302 19.051163-2.857674 38.578605-6.906047 43.341396-8.811163 13.573953-5.953488 24.766512-17.384186 32.148837-33.339535 6.667907-14.526512 6.906047-15.955349 6.906047-53.105116-0.23814-41.19814-1.666977-50.247442-15.955349-87.15907-21.194419-55.486512-76.91907-110.734884-132.167442-130.738604-11.430698-4.048372-33.577674-9.525581-49.294884-12.383256-26.195349-4.286512-31.196279-4.524651-53.819535-1.905117-44.770233 5.23907-72.394419 14.050233-103.352558 32.625117-19.527442 11.906977-20.956279 13.097674-44.532093 36.435349-34.530233 34.053953-52.390698 67.155349-63.345116 116.688372-19.051163 86.92093 15.47907 178.604651 87.873488 233.853023 30.243721 23.099535 74.537674 41.674419 106.686512 44.770232 27.624186 2.857674 66.67907 1.190698 76.91907-3.095813z" fill="#3A25DD" p-id="4775"></path></svg>'),
            ali: "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1756540539411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5761" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M841.984 576.554667a18.816 18.816 0 0 1-13.184-21.973334c41.941333-200.448-75.605333-402.346667-269.226667-456.021333-199.509333-55.125333-405.333333 67.285333-459.52 273.109333v0.981334a460.586667 460.586667 0 0 0 62.464 371.2 439.893333 439.893333 0 0 0 208.768 167.765333c236.544 89.301333 491.178667-44.373333 566.272-283.349333a23.04 23.04 0 0 0-15.573333-29.269334l-80-22.442666z m-393.130667 194.133333c-72.704-20.010667-133.162667-68.266667-170.752-135.125333a298.112 298.112 0 0 1-28.288-219.989334C282.026667 293.12 404.48 220.501333 523.52 253.141333c112.64 31.232 182.4 146.346667 161.92 262.912a21.205333 21.205333 0 0 0 15.104 24.405334l75.605333 20.949333a17.493333 17.493333 0 0 1 11.733334 22.954667c-47.36 142.933333-195.114667 225.834667-338.986667 186.325333z" fill="#6666FF" p-id="5762"></path></svg>'),
            baidu: "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1756540564286" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6851" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M292.571429 435.931429c-1.462857-11.702857-2.925714-24.868571-2.925715-38.034286C289.645714 275.017143 389.12 175.542857 512 175.542857c122.88 0 222.354286 99.474286 222.354286 223.817143 0 13.165714-1.462857 24.868571-2.925715 38.034286 112.64 0 204.8 92.16 204.8 206.262857 0 112.64-92.16 204.8-206.262857 204.8-57.051429 0-109.714286-23.405714-146.285714-61.44-19.017143-20.48-19.017143-52.662857 0-71.68 20.48-20.48 52.662857-20.48 71.68 0l1.462857 1.462857c19.017143 17.554286 43.885714 29.257143 71.68 29.257143 57.051429 0 103.862857-46.811429 103.862857-103.862857 0-57.051429-46.811429-103.862857-103.862857-103.862857-26.331429 0-49.737143 10.24-68.754286 26.331428l-1.462857 1.462857-5.851428 5.851429-4.388572 4.388571-207.725714 210.651429c-38.034286 38.034286-89.234286 61.44-146.285714 61.44C179.931429 848.457143 87.771429 756.297143 87.771429 642.194286c0-112.64 90.697143-204.8 204.8-206.262857m1.462857 310.125714c57.051429 0 103.862857-46.811429 103.862857-103.862857 0-57.051429-46.811429-103.862857-103.862857-103.862857-57.051429 0-103.862857 46.811429-103.862857 103.862857 0 57.051429 46.811429 103.862857 103.862857 103.862857M512 520.777143c67.291429 0 121.417143-54.125714 121.417143-121.417143 0-67.291429-54.125714-121.417143-121.417143-121.417143-67.291429 0-121.417143 54.125714-121.417143 121.417143 0 65.828571 54.125714 121.417143 121.417143 121.417143" fill="#06A7FF" p-id="6852"></path><path d="M631.954286 412.525714v-5.851428c0-27.794286 23.405714-51.2 51.2-51.2s51.2 23.405714 51.2 51.2v5.851428c-7.314286 117.028571-103.862857 209.188571-222.354286 209.188572s-215.04-92.16-222.354286-209.188572v-5.851428c0-27.794286 23.405714-51.2 51.2-51.2s51.2 23.405714 51.2 51.2v5.851428c5.851429 61.44 58.514286 108.251429 119.954286 108.251429 62.902857 0 114.102857-46.811429 119.954286-108.251429" fill="#FF436A" p-id="6853"></path></svg>'),
            tianyi: "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1756540718396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8675" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M833.39946667 423.28746667a185.00266667 185.00266667 0 0 0-205.55093334-134.07573333A226.304 226.304 0 0 0 463.0528 217.6c-93.52533333 0-176.5376 58.29973333-209.92 143.01866667A210.80746667 210.80746667 0 0 0 34.13333333 571.01653334c0 116.05333333 94.48106667 210.5344 210.5344 210.5344h281.87306667a41.09653333 41.09653333 0 0 0 0-82.1248H244.66773333a128.54613333 128.54613333 0 0 1-128.34133333-128.4096 128.54613333 128.54613333 0 0 1 157.01333333-125.20106667l40.82346667 9.35253333 8.46506667-41.09653333a143.7696 143.7696 0 0 1 140.42453333-114.34666667c45.73866667 0 89.15626667 22.18666667 116.05333333 59.32373334l17.47626667 24.02986666 28.2624-9.0112a101.5808 101.5808 0 0 1 132.36906667 88.95146667l2.79893333 35.97653333 36.0448 1.8432a117.62346667 117.62346667 0 0 1 111.68426667 117.62346667 117.89653333 117.89653333 0 0 1-128.88746667 117.21386667l-4.36906667-0.54613334a115.3024 115.3024 0 0 1-6.48533333-1.024l-5.12-1.09226666a128.88746667 128.88746667 0 0 1-15.83786667-4.98346667 133.46133333 133.46133333 0 0 1-10.4448-4.7104l-3.75466666-1.91146667a119.73973333 119.73973333 0 0 1-6.82666667-4.16426666l-2.2528-1.36533334a118.23786667 118.23786667 0 0 1-47.78666667-67.65226666h69.4272l-113.73226666-162.47466667-113.73226667 162.47466667h74.41066667c7.23626667 48.46933333 31.88053333 91.27253333 67.44746666 121.78773333l2.18453334 2.048 2.18453333 1.6384a182.39466667 182.39466667 0 0 0 9.216 7.03146667l4.02773333 2.8672c3.75466667 2.52586667 7.5776 4.98346667 11.53706667 7.30453333l3.072 1.77493333c4.36906667 2.4576 8.73813333 4.77866667 13.24373333 6.82666667l1.57013334 0.68266667c15.01866667 6.9632 31.06133333 12.01493333 47.78666666 15.01866666l1.36533334 0.2048c5.12 0.95573333 10.4448 1.6384 15.7696 2.11626667l2.048 0.13653333a203.22986667 203.22986667 0 0 0 46.55786666-1.57013333A200.22613333 200.22613333 0 0 0 989.86666667 618.46186667a199.81653333 199.81653333 0 0 0-156.4672-195.24266667" p-id="8676"></path></svg>'),
            mobile: "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1756540741796" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9705" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M1020.16 266.88c-44.16 11.52-88.32 21.12-133.12 30.08-28.8 5.76-57.6 11.52-87.04 14.08-35.84 3.84-71.04 5.12-106.88 7.04-81.92 3.84-163.84 2.56-245.76 1.92-64.64-0.64-129.92 0-193.28 13.44-56.96 12.16-111.36 30.08-159.36 64-30.08 21.12-59.52 43.52-94.72 55.68 1.92 5.76 7.04 4.48 10.88 4.48 37.76 1.28 75.52-1.92 112.64-6.4 24.96-3.2 50.56-6.4 75.52-10.24 32-5.12 64-6.4 96-8.32 17.92-1.28 35.84-1.92 53.76 1.28 12.8 1.92 16.64 9.6 10.88 21.12-3.2 7.04-8.96 12.8-14.08 18.56-14.72 15.36-32 28.16-48 42.24-40.96 36.48-80.64 75.52-119.04 115.2-21.12 21.76-41.6 44.16-53.76 72.32-29.44 68.48-26.88 134.4 17.28 195.2 33.92 46.72 85.76 65.28 140.16 75.52 28.16 5.12 56.96 3.2 85.76 3.2 87.04 0 174.08-0.64 261.12 1.28 51.84 1.28 103.04 1.28 154.24-7.04 52.48-8.32 95.36-34.56 125.44-77.44 42.88-60.8 54.4-128.64 37.12-200.96-12.16-51.2-37.12-94.72-80.64-126.08-69.76-49.28-147.84-64-231.68-48.64-32.64 5.76-61.44 20.48-83.2 45.44-43.52 49.92-47.36 107.52-27.52 167.04 17.28 52.48 81.92 81.28 136.96 65.28 24.96-7.04 44.8-21.76 55.04-46.08 8.32-18.56 1.92-35.2-15.36-42.24-2.56 26.88-14.72 38.4-42.88 39.04H640a54.912 54.912 0 0 1-53.12-56.32c0-31.36 26.88-67.84 59.52-78.72 51.84-17.28 98.56-8.32 140.16 27.52 40.96 36.48 55.04 97.92 30.72 140.8-24.32 43.52-64 67.84-111.36 78.08-40.96 8.32-82.56 8.96-124.16 10.88-44.16 1.92-88.32 1.28-132.48-1.28-33.28-1.92-67.2-4.48-99.84-11.52-28.8-6.4-56.96-14.72-79.36-35.2a61.696 61.696 0 0 1-21.76-51.84c2.56-34.56 17.28-64.64 39.68-90.88a3790.08 3790.08 0 0 1 190.72-202.24c25.6-25.6 56.96-40.32 92.8-43.52 32-2.56 63.36-3.84 95.36-5.76 58.88-3.84 117.12-11.52 174.72-27.52 64-17.28 120.96-46.72 161.92-101.12 7.68-9.6 15.36-19.2 18.56-32h-3.84zM869.12 44.8c0 7.68-3.84 13.44-7.04 19.2-19.2 35.84-49.92 58.88-84.48 77.44-48 26.24-99.84 41.6-153.6 49.28-65.92 9.6-132.48 8.32-199.04 7.04-78.08-1.92-156.16 1.92-232.96 16.64-23.04 4.48-46.08 6.4-69.12 9.6-3.84 0-8.32 1.28-14.08 1.92 1.92-1.92 3.2-2.56 4.48-3.84 13.44-7.04 24.32-17.28 33.92-28.8 40.32-48.64 91.52-75.52 153.6-85.12 44.8-7.04 90.24-7.68 135.68-9.6 65.92-1.92 131.2-1.28 197.12-6.4 78.08-5.76 154.24-22.4 228.48-46.08 1.92 0 3.84-0.64 6.4-1.28z" fill="#0090FE" p-id="9706"></path></svg>'),
            "115": "data:image/svg+xml;base64," + btoa('<svg t="1758974307798" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13186" width="200" height="200"><path d="M701.004655 35.208896c29.184693-0.150426 57.568137-7.509021 84.900645-17.220197 20.924565 9.561773-3.704368 30.886451-7.559163 44.903699-9.81146 18.4717-18.371416 37.594223-29.084409 55.516408-10.562567 15.618723-29.785374 24.128537-48.4075 23.228027-75.139328-0.100284-150.228513 0-225.367841-0.050142-21.425985-0.851391-42.250266 12.565177-50.960649 32.03767-11.763928 24.329105-25.080212 47.957245-36.193317 72.586179 67.680449 13.216 137.012514 25.430182 198.886723 57.31845 58.670238 29.9358 109.880573 76.740802 139.615804 136.01172 37.294394 72.836889 39.797401 162.54298 5.106298 236.882082C696.149067 753.612827 625.013937 810.830993 545.56956 838.764182c-95.764064 32.989345-205.795063 33.939997-297.453622-12.214183-0.550539-0.751107-1.701758-2.252297-2.302439-3.053546 89.155553 11.914354 183.668113-3.604084 260.560364-51.611471 49.659003-30.836309 89.305979-80.195483 101.069907-138.214898 11.062963-44.803415 2.753717-93.411483-22.577205-131.957381-38.845727-60.021002-102.421694-100.519368-169.70203-121.895211-63.825654-21.926382-131.005706-30.036084-197.685361-37.594223 47.306422-93.110631 93.66117-186.721659 140.567479-280.032858 8.760524-17.020652 28.234041-27.432793 47.206138-26.78197C503.81969 35.208896 602.437755 35.609009 701.004655 35.208896z" fill="#224888" p-id="13187"></path></svg>'),
            xunlei: "data:image/svg+xml;base64," + btoa('<svg t="1758974328647" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14190" width="200" height="200"><path d="M432.64 407.04s199.68-217.6 468.48-322.56c0 0 12.8-5.12 2.56 7.68s-56.32 84.48-66.56 97.28l-35.84 33.28 17.92-5.12-35.84 79.36-46.08 46.08 33.28-10.24-38.4 92.16-40.96 40.96 35.84-20.48s-17.92 38.4-35.84 66.56c0 0 163.84 17.92 302.08 81.92 0 0-76.8 20.48-107.52 28.16l-33.28-7.68 15.36 10.24-35.84 15.36c-2.56 0-28.16-7.68-40.96-2.56 0 0 15.36 5.12 17.92 10.24l-38.4 15.36s-7.68 5.12-15.36 5.12c-5.12 0-38.4-7.68-48.64-2.56 0 0 20.48 10.24 28.16 10.24 0 0-12.8 17.92-122.88 23.04 0 0 81.92 227.84 79.36 258.56-2.56 30.72-48.64-35.84-48.64-35.84s-69.12-76.8-89.6-92.16c-20.48-15.36-79.36-25.6-204.8-104.96s-125.44-181.76-117.76-230.4c7.68-48.64 7.68-84.48-23.04-94.72s-81.92-23.04-189.44-25.6c0 0-17.92-12.8 12.8-12.8 30.72 2.56 112.64 2.56 156.16-5.12 48.64-10.24 66.56-25.6 104.96-20.48 38.4 5.12 87.04 17.92 140.8 71.68z" fill="#1390F2" p-id="14191"></path></svg>'),
            uc: "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1758974377018" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17084" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M240.32 674.282667c11.093333-57.856 42.837333-102.656 89.450667-136.896 28.458667-20.885333 58.709333-39.338667 88.362666-58.538667 47.36-30.634667 87.018667-67.989333 107.221334-122.304 22.592-60.650667 20.970667-119.701333-20.117334-171.818667-52.053333-66.005333-122.389333-86.208-203.648-71.658666-59.093333 10.581333-107.52 41.173333-149.397333 82.88-17.429333 17.344-32.256 36.778667-43.648 61.354666 3.925333-2.645333 6.037333-4.053333 8.106667-5.482666 22.549333-15.722667 47.36-23.253333 74.986666-22.186667 46.144 1.813333 84.352 41.088 85.397334 87.189333 0.682667 30.336-8.725333 57.386667-26.88 80.704-23.104 29.76-48 58.112-72.298667 86.933334-52.266667 62.08-79.338667 132.672-68.416 214.336 10.965333 82.090667 53.802667 144.064 126.528 183.808 45.845333 25.024 96.149333 33.344 150.378667 32.832-2.922667-1.237333-4.096-1.856-5.333334-2.197334-104.170667-28.672-159.253333-142.016-140.693333-238.933333zM653.184 473.6c42.176 13.888 80.213333 36.138667 118.826667 57.344 40.576 22.293333 83.285333 23.210667 127.018666 10.304 8.533333-2.517333 12.010667-7.168 11.178667-16.042667-1.066667-11.690667-0.448-23.594667-2.197333-35.157333-11.584-76.970667-53.141333-130.026667-126.997334-156.288-9.258667-3.285333-12.224-8.405333-14.976-17.194667-5.290667-16.853333-12.416-33.237333-19.925333-49.28-3.093333-6.613333-9.088-11.84-14.869333-19.050666-5.504 8.234667-10.176 14.357333-13.930667 21.013333-14.122667 24.917333-18.666667 52.373333-19.690667 80.426667-0.298667 8.618667-2.56 14.997333-9.408 19.754666-15.189333 10.538667-29.632 22.549333-45.888 31.082667-34.794667 18.218667-70.549333 34.624-104.96 51.285333 39.018667-0.213333 77.653333 9.237333 115.84 21.802667z m43.456 380.224c-14.826667-3.456-30.058667-5.162667-45.738667-7.765333 0.789333-2.986667 1.365333-5.546667 2.154667-8.064 11.52-36.458667 13.568-73.386667 8.789333-111.36-15.893333-126.421333-143.893333-202.218667-246.506666-180.288-54.613333 11.648-93.269333 42.154667-115.690667 93.226666 82.154667-81.365333 205.12-56.512 255.872 13.781334 33.493333 46.378667 42.602667 97.408 25.472 152-17.173333 54.762667-56.661333 88.533333-111.573333 109.653333 70.634667 1.984 266.624-4.16 290.432-11.733333-2.666667-5.12-4.672-10.453333-7.914667-14.869334-13.845333-18.730667-33.088-29.44-55.296-34.581333z m-158.72-97.877333c-0.490667-64.533333-49.024-117.546667-117.056-117.909334-73.429333-0.362667-118.229333 59.946667-118.229333 117.717334 0 61.76 51.136 118.186667 117.546666 117.12 65.194667-0.042667 118.250667-52.266667 117.76-116.928z m-118.336 53.397333a53.461333 53.461333 0 0 1-53.333333-54.144c0.128-29.312 25.386667-54.464 54.186666-53.973333 29.248 0.490667 54.08 25.344 54.293334 54.314666 0.213333 29.632-24.704 53.930667-55.146667 53.802667z m493.653333-168.576c-5.866667-23.061333-22.058667-35.882667-43.904-41.322667-15.210667-3.818667-31.04-5.290667-46.656-7.296-42.645333-5.504-80.149333-23.210667-116.096-45.994666-72.213333-45.76-150.976-65.92-236.373333-55.978667-14.784 1.728-29.098667 7.402667-43.626667 11.242667l0.768 3.072c9.386667 0 18.88-0.917333 28.16 0.170666 22.570667 2.666667 45.717333 3.861333 67.456 9.898667 77.056 21.44 132.288 71.104 171.669334 139.306667 5.610667 9.749333 11.968 16.277333 22.826666 16.853333 15.616 0.853333 31.488 2.432 46.826667 0.426667a125.013333 125.013333 0 0 0 39.125333-12.458667c35.072-17.6 70.677333-25.450667 109.077334-10.752 0.853333-2.026667 1.344-2.645333 1.322666-3.221333a19.626667 19.626667 0 0 0-0.597333-3.946667z" fill="#FC7A28" p-id="17085"></path></svg>'),
            bilibili: "data:image/svg+xml;base64," + btoa('<svg t="1760446076356" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15778" width="200" height="200"><path d="M306.005333 117.632L444.330667 256h135.296l138.368-138.325333a42.666667 42.666667 0 0 1 60.373333 60.373333L700.330667 256H789.333333A149.333333 149.333333 0 0 1 938.666667 405.333333v341.333334a149.333333 149.333333 0 0 1-149.333334 149.333333h-554.666666A149.333333 149.333333 0 0 1 85.333333 746.666667v-341.333334A149.333333 149.333333 0 0 1 234.666667 256h88.96L245.632 177.962667a42.666667 42.666667 0 0 1 60.373333-60.373334zM789.333333 341.333333h-554.666666a64 64 0 0 0-63.701334 57.856L170.666667 405.333333v341.333334a64 64 0 0 0 57.856 63.701333L234.666667 810.666667h554.666666a64 64 0 0 0 63.701334-57.856L853.333333 746.666667v-341.333334A64 64 0 0 0 789.333333 341.333333zM341.333333 469.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666666-42.666667z m341.333334 0a42.666667 42.666667 0 0 1 42.666666 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666667-42.666667z" fill="#fb7299" p-id="15779"></path></svg>'),
            "123": "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1759299472449" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9534" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M296.48 1018.44c-157.16 0-285-129.24-285-288.12V293.72C11.48 134.84 139.32 5.6 296.48 5.6h431.04c157.16 0 285 129.24 285 288.12v436.56c0 158.88-127.84 288.12-285 288.12H296.48z" fill="#FFFFFF" p-id="9535"></path><path d="M306.08 68.08h411.88c128.4 0 232.32 105.24 232.32 235.32v417.16c0 130.08-103.92 235.32-232.32 235.32H306.08c-128.4 0-232.32-105.24-232.32-235.32V303.4c-0.04-130.04 103.88-235.32 232.32-235.32z" fill="#597DFC" p-id="9536"></path><path d="M234.88 304.48H147.24v415.04h87.64V304.48z m129.28 304.84c0.44-21.6 3.8-35.72 10.36-42.36 4.84-6.64 12.48-11.12 22.4-13.68 9.72-2.56 10.12-2.36 30.64-2.56h23.24c42.68 0 52.6-6.4 73.92-19.24 14.36-8.76 23.24-23.32 31.48-41.92 8.24-18.4 12.24-39.8 12.24-63.76 0-19.48-3.4-37.64-9.92-54.32-6.56-16.92-16.04-30.16-28.32-40.2-20.48-17.76-37.6-26.76-109.4-26.76H283.48v74h118.92c23.04 0 39.48 3.2 49.84 9.4 13.52 8.76 20.28 22.48 20.28 41.08 0 17.12-7.4 29.96-22.16 38.52-9.52 5.36-17.96 8.12-40.56 8.12h-14.16c-27.88 0-34.64 1.92-47.72 5.56-13.08 3.64-25.12 10.92-36.32 21.84-23.64 24.4-35.28 59.88-34.44 106.32v110.16h280.48v-73.36H363.72v-36.8h0.44z m353.56 110.2c30.64 0 53.64-1.48 69.08-4.72 15.44-3.2 29.56-9 42.68-17.76 29.56-19.04 44.16-48.36 44.16-87.72 0-42.8-18.16-76.16-54.72-100.12 36.56-21.6 54.72-51.56 54.72-90.28 0-22.48-4.24-44.28-16.48-63.96-12.24-21.16-31.04-34.64-52.4-42.56-9.08-3.44-17.32-5.36-24.92-6.2-7.6-0.84-24.92-1.48-51.96-1.92h-117v74h101.8c14.36 0 24.52 0.44 30.4 1.48 5.92 1.08 11.2 3.2 15.64 6.64 12.24 8.36 18.36 21.6 18.36 39.8 0 16.68-4.64 28.88-14.16 36.8-7.8 6.64-24.52 10.04-50.28 10.04h-62.96v73.36h62.96c21.32 0 36.32 2.56 44.76 7.48 13.52 7.92 20.28 22.24 20.28 43 0 17.12-5.28 29.96-16.04 38.52-8.64 7.08-24.92 10.48-49.2 10.48h-101.8v73.36h107.08v0.28z" fill="#FFFFFF" p-id="9537"></path></svg>'),
            "lanzou": "data:image/svg+xml;base64," + btoa('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1759812902857" class="icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5010" xmlns:xlink="http://www.w3.org/1999/xlink" width="200.9765625" height="200"><path d="M2.56 2.56H1024V1024H2.56V2.56z" fill="#FFFFFF" p-id="5011"></path><path d="M0 817.152c17.92-25.088 54.784-69.632 117.248-102.4 49.152-25.6 94.208-33.28 122.368-35.84-31.744-112.128 13.824-230.4 107.008-286.208 76.8-45.568 175.104-43.52 255.488 5.12 14.336-31.232 71.168-144.896 204.288-204.288 95.232-42.496 181.248-35.84 219.648-30.72V5.12C684.544 3.584 342.016 1.536 0 0v817.152z" fill="#FF6600" p-id="5012"></path></svg>')
          };
          return icons[platform] || icons.quark;
        };
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const now = /* @__PURE__ */ new Date();
          const diff = now - date;
          const minute = 60 * 1e3;
          const hour = 60 * minute;
          const day = 24 * hour;
          if (diff < minute) {
            return "刚刚";
          } else if (diff < hour) {
            return Math.floor(diff / minute) + "分钟前";
          } else if (diff < day) {
            return Math.floor(diff / hour) + "小时前";
          } else {
            return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-");
          }
        };
        const handleCopySuccess = (text) => {
          successMessage.value = "已复制到剪贴板";
          setTimeout(() => {
            successMessage.value = "";
          }, 2e3);
        };
        const openLink = async (url, password) => {
          try {
            window.open(url, "_blank");
            if (password) {
              try {
                await navigator.clipboard.writeText(password);
                successMessage.value = `链接已打开，提取码 "${password}" 已复制到剪贴板`;
              } catch (clipboardErr) {
                const textArea = document.createElement("textarea");
                textArea.value = password;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                  document.execCommand("copy");
                  successMessage.value = `链接已打开，提取码 "${password}" 已复制到剪贴板`;
                } catch (fallbackErr) {
                  successMessage.value = `链接已打开，提取码: ${password} (请手动复制)`;
                } finally {
                  document.body.removeChild(textArea);
                }
              }
            } else {
              successMessage.value = "链接已打开";
            }
            setTimeout(() => {
              successMessage.value = "";
            }, 3e3);
          } catch (err) {
            console.error("操作失败:", err);
            error2.value = "操作失败";
          }
        };
        const handleLinkRightClick = (event, link) => {
          event.preventDefault();
          openLink(link.url, link.password);
        };
        const toggleExpanded = (linkId) => {
          if (expandedItems.value.has(linkId)) {
            expandedItems.value.delete(linkId);
          } else {
            expandedItems.value.add(linkId);
            checkLinkStatus(linkId);
          }
        };
        const isExpanded = (linkId) => {
          return expandedItems.value.has(linkId);
        };
        const clearExpandedItems = () => {
          expandedItems.value.clear();
          linkCheckStatus.value.clear();
          checkingLinks.value.clear();
        };
        const checkLinkStatus = async (linkId) => {
          const link = links.value.find((l) => l.id === linkId);
          if (!link || !link.url) return;
          if (checkingLinks.value.has(linkId) || linkCheckStatus.value.has(linkId)) {
            return;
          }
          const linkInfo = linkChecker.identifyLink(link.url);
          if (!linkInfo) {
            return;
          }
          checkingLinks.value.add(linkId);
          linkCheckStatus.value.set(linkId, { state: 0, message: "检测中..." });
          try {
            const result = await linkChecker.checkLink(link.url);
            const stateInfo = linkChecker.getStateInfo(result.state);
            linkCheckStatus.value.set(linkId, {
              state: result.state,
              message: stateInfo.text,
              class: stateInfo.class,
              color: stateInfo.color
            });
          } catch (error3) {
            console.error("链接检测失败:", error3);
            linkCheckStatus.value.set(linkId, {
              state: 0,
              message: "检测失败",
              class: "error",
              color: "#ff4d4f"
            });
          } finally {
            checkingLinks.value.delete(linkId);
          }
        };
        const getLinkCheckStatus = (linkId) => {
          return linkCheckStatus.value.get(linkId) || null;
        };
        const getLinkUrlClass = (linkId) => {
          const status = getLinkCheckStatus(linkId);
          if (!status) return "";
          const classMap = {
            1: "one-pan-tip-success",
            // 有效
            2: "one-pan-tip-success",
            // 需要密码 - 显示为有效图标
            0: "",
            // 检测中
            [-1]: "one-pan-tip-error",
            // 失效
            11: "one-pan-tip-partial"
            // 部分违规
          };
          return classMap[status.state] || "one-pan-tip-other";
        };
        const getLinkStatusTooltip = (linkId) => {
          const status = getLinkCheckStatus(linkId);
          if (!status) return "";
          return status.message || "";
        };
        watch(() => props.subjectId, async (newId) => {
          if (newId) {
            clearExpandedItems();
            if (!userStore$1.initialized.value) {
              isAuthInitializing.value = true;
              await userStore$1.initAuth();
              isAuthInitializing.value = false;
            }
            loadLinks(1, true);
          }
        }, { immediate: true });
        watch(() => props.linkType, async (newType) => {
          clearExpandedItems();
          if (newType === "netdisk") {
            filter.platform = storageHelper.getPlatformPreference();
          } else {
            filter.platform = "";
          }
          pagination.value.page = 1;
          if (props.subjectId) {
            if (!userStore$1.initialized.value) {
              isAuthInitializing.value = true;
              await userStore$1.initAuth();
              isAuthInitializing.value = false;
            }
            loadLinks(1, false);
          }
        });
        const goToPage = (page) => {
          if (page >= 1 && page <= pagination.value.pages) {
            clearExpandedItems();
            loadLinks(page);
          }
        };
        const goToPrevPage = () => {
          if (pagination.value.page > 1) {
            goToPage(pagination.value.page - 1);
          }
        };
        const goToNextPage = () => {
          if (pagination.value.page < pagination.value.pages) {
            goToPage(pagination.value.page + 1);
          }
        };
        const scrollToUserSection = () => {
          const userSection = document.querySelector(".auth-container") || document.querySelector(".auth-component") || document.querySelector("[data-auth-component]") || document.querySelector("#user-section");
          if (userSection) {
            userSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          } else {
            const userTabBtn = document.querySelector('.nav-btn[data-tab="user"]') || document.querySelector('button[data-tab="user"]') || Array.from(document.querySelectorAll(".nav-btn")).find(
              (btn) => btn.textContent.includes("👤") || btn.textContent.includes("用户")
            );
            if (userTabBtn) {
              userTabBtn.click();
            } else {
              const event = new CustomEvent("switchToUserTab", {
                bubbles: true,
                detail: { tab: "user" }
              });
              document.dispatchEvent(event);
            }
          }
        };
        onMounted(async () => {
          if (!userStore$1.initialized.value) {
            isAuthInitializing.value = true;
            await userStore$1.initAuth();
            isAuthInitializing.value = false;
          }
          if (props.subjectId) {
            loadLinks();
          }
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock(Fragment, null, [
            createBaseVNode("div", _hoisted_1$4, [
              createVNode(Transition, { name: "modal" }, {
                default: withCtx(() => [
                  showModifyForm.value ? (openBlock(), createElementBlock("div", _hoisted_2$4, [
                    createBaseVNode("div", _hoisted_3$4, [
                      createBaseVNode("div", _hoisted_4$4, [
                        createBaseVNode("button", {
                          class: "close-btn",
                          onClick: closeModifyModal
                        }, _cache[39] || (_cache[39] = [
                          createBaseVNode("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "currentColor"
                          }, [
                            createBaseVNode("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })
                          ], -1)
                        ])),
                        _cache[40] || (_cache[40] = createBaseVNode("h4", null, "修改链接", -1)),
                        createBaseVNode("button", {
                          class: "header-submit-btn",
                          form: "modify-link-form",
                          type: "submit",
                          disabled: isSubmitting.value
                        }, toDisplayString(isSubmitting.value ? "修改中..." : "完成"), 9, _hoisted_5$3)
                      ]),
                      createBaseVNode("div", _hoisted_6$3, [
                        createBaseVNode("form", {
                          onSubmit: withModifiers(handleModifyLink, ["prevent"]),
                          id: "modify-link-form"
                        }, [
                          createBaseVNode("div", _hoisted_7$3, [
                            createBaseVNode("div", _hoisted_8$3, [
                              _cache[41] || (_cache[41] = createBaseVNode("label", null, "标题描述 *", -1)),
                              createBaseVNode("div", _hoisted_9$3, [
                                withDirectives(createBaseVNode("input", {
                                  type: "text",
                                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modifyLink.title = $event),
                                  placeholder: "简短描述这个链接"
                                }, null, 512), [
                                  [vModelText, modifyLink.title]
                                ])
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_10$3, [
                            _cache[43] || (_cache[43] = createBaseVNode("label", null, "链接地址 *", -1)),
                            createBaseVNode("div", _hoisted_11$3, [
                              createVNode(UrlInput, {
                                modelValue: modifyLink.url,
                                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => modifyLink.url = $event),
                                "recognized-url": cleanedModifyUrl.value,
                                placeholder: "会自动识别链接类型以及提取码，且只有黑色部分会被提交",
                                required: ""
                              }, null, 8, ["modelValue", "recognized-url"])
                            ]),
                            modifyLink.url && cleanedModifyUrl.value ? (openBlock(), createElementBlock("div", _hoisted_12$3, [
                              _cache[42] || (_cache[42] = createBaseVNode("small", { class: "url-preview-label" }, "识别后的链接：", -1)),
                              createBaseVNode("small", _hoisted_13$3, toDisplayString(cleanedModifyUrl.value), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_14$3, [
                            createBaseVNode("div", _hoisted_15$3, [
                              _cache[44] || (_cache[44] = createBaseVNode("label", null, "链接类型 *", -1)),
                              createVNode(CustomSelect, {
                                modelValue: modifyLink.linkType,
                                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => modifyLink.linkType = $event),
                                options: linkTypeOptions,
                                placeholder: "请选择类型",
                                onChange: _cache[3] || (_cache[3] = ($event) => modifyLink.platform = "")
                              }, null, 8, ["modelValue"])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_16$1, [
                            modifyLink.linkType === "netdisk" ? (openBlock(), createElementBlock("div", _hoisted_17$1, [
                              _cache[45] || (_cache[45] = createBaseVNode("label", null, "平台", -1)),
                              createVNode(CustomSelect, {
                                modelValue: modifyLink.platform,
                                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => modifyLink.platform = $event),
                                options: currentPlatformOptions.value,
                                placeholder: "请选择平台"
                              }, null, 8, ["modelValue", "options"])
                            ])) : createCommentVNode("", true),
                            modifyLink.linkType === "netdisk" ? (openBlock(), createElementBlock("div", _hoisted_18$1, [
                              _cache[46] || (_cache[46] = createBaseVNode("label", null, "提取码", -1)),
                              createBaseVNode("div", _hoisted_19$1, [
                                withDirectives(createBaseVNode("input", {
                                  type: "text",
                                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => modifyLink.extractCode = $event),
                                  placeholder: "如有提取码请填写",
                                  maxlength: "10"
                                }, null, 512), [
                                  [vModelText, modifyLink.extractCode]
                                ])
                              ])
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_20$1, [
                            _cache[47] || (_cache[47] = createBaseVNode("label", null, "原文链接", -1)),
                            createBaseVNode("div", _hoisted_21$1, [
                              withDirectives(createBaseVNode("input", {
                                type: "text",
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => modifyLink.original_url = $event),
                                placeholder: "原文链接地址（可选）"
                              }, null, 512), [
                                [vModelText, modifyLink.original_url]
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_22$1, [
                            createBaseVNode("div", _hoisted_23$1, [
                              _cache[48] || (_cache[48] = createBaseVNode("label", null, "文件大小", -1)),
                              createBaseVNode("div", _hoisted_24$1, [
                                withDirectives(createBaseVNode("input", {
                                  type: "text",
                                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => modifyLink.size = $event),
                                  placeholder: "如: 2.5G 或 1024M（剧集一般填写单集平均大小）",
                                  pattern: "^\\d+(\\.\\d+)?[GMgm]$",
                                  title: "请输入数字+G或M，如: 2.5G 或 1024M"
                                }, null, 512), [
                                  [vModelText, modifyLink.size]
                                ])
                              ])
                            ])
                          ]),
                          props.subjectCategory === "movies" || props.subjectCategory === "albums" ? (openBlock(), createElementBlock("div", _hoisted_25$1, [
                            _cache[49] || (_cache[49] = createBaseVNode("label", null, "特性标签", -1)),
                            createBaseVNode("div", _hoisted_26$1, [
                              props.subjectCategory === "movies" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                                createVNode(CheckBox, {
                                  modelValue: modifyLink.has_4k,
                                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => modifyLink.has_4k = $event),
                                  label: "4K画质",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: modifyLink.has_hdr,
                                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => modifyLink.has_hdr = $event),
                                  label: "HDR",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: modifyLink.has_dolby_atmos,
                                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => modifyLink.has_dolby_atmos = $event),
                                  label: "杜比全景声",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: modifyLink.has_subtitles,
                                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => modifyLink.has_subtitles = $event),
                                  label: "软字幕",
                                  color: "green"
                                }, null, 8, ["modelValue"])
                              ], 64)) : props.subjectCategory === "albums" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                                createVNode(CheckBox, {
                                  modelValue: modifyLink.is_flac,
                                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => modifyLink.is_flac = $event),
                                  label: "FLAC无损",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: modifyLink.is_wav,
                                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => modifyLink.is_wav = $event),
                                  label: "WAV无损",
                                  color: "green"
                                }, null, 8, ["modelValue"])
                              ], 64)) : createCommentVNode("", true)
                            ])
                          ])) : createCommentVNode("", true)
                        ], 32)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(Transition, { name: "modal" }, {
                default: withCtx(() => [
                  showAddForm.value ? (openBlock(), createElementBlock("div", _hoisted_27$1, [
                    createBaseVNode("div", _hoisted_28$1, [
                      createBaseVNode("div", _hoisted_29$1, [
                        createBaseVNode("button", {
                          class: "close-btn",
                          onClick: closeModal
                        }, _cache[50] || (_cache[50] = [
                          createBaseVNode("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "currentColor"
                          }, [
                            createBaseVNode("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })
                          ], -1)
                        ])),
                        createBaseVNode("button", {
                          class: "header-submit-btn",
                          form: "add-link-form",
                          type: "submit",
                          disabled: isSubmitting.value
                        }, toDisplayString(isSubmitting.value ? "添加中..." : "完成"), 9, _hoisted_30$1)
                      ]),
                      createBaseVNode("div", _hoisted_31$1, [
                        createBaseVNode("form", {
                          onSubmit: withModifiers(handleAddLink, ["prevent"]),
                          id: "add-link-form"
                        }, [
                          createBaseVNode("div", _hoisted_32$1, [
                            createBaseVNode("div", _hoisted_33$1, [
                              _cache[51] || (_cache[51] = createBaseVNode("label", null, "标题描述 *", -1)),
                              createBaseVNode("div", _hoisted_34$1, [
                                withDirectives(createBaseVNode("input", {
                                  type: "text",
                                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => newLink.title = $event),
                                  placeholder: "简短描述这个链接"
                                }, null, 512), [
                                  [vModelText, newLink.title]
                                ])
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_35$1, [
                            _cache[53] || (_cache[53] = createBaseVNode("label", null, "链接地址 *", -1)),
                            createBaseVNode("div", _hoisted_36$1, [
                              createVNode(UrlInput, {
                                modelValue: newLink.url,
                                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => newLink.url = $event),
                                "recognized-url": cleanedNewUrl.value,
                                placeholder: "会自动识别链接类型以及提取码，且只有黑色部分会被提交",
                                required: ""
                              }, null, 8, ["modelValue", "recognized-url"])
                            ]),
                            newLink.url && cleanedNewUrl.value ? (openBlock(), createElementBlock("div", _hoisted_37$1, [
                              _cache[52] || (_cache[52] = createBaseVNode("small", { class: "url-preview-label" }, "识别后的链接：", -1)),
                              createBaseVNode("small", _hoisted_38$1, toDisplayString(cleanedNewUrl.value), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_39$1, [
                            createBaseVNode("div", _hoisted_40$1, [
                              _cache[54] || (_cache[54] = createBaseVNode("label", null, "链接类型 *", -1)),
                              createVNode(CustomSelect, {
                                modelValue: newLink.linkType,
                                "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => newLink.linkType = $event),
                                options: linkTypeOptions,
                                placeholder: "请选择类型",
                                onChange: _cache[17] || (_cache[17] = ($event) => newLink.platform = "")
                              }, null, 8, ["modelValue"])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_41$1, [
                            newLink.linkType === "netdisk" ? (openBlock(), createElementBlock("div", _hoisted_42$1, [
                              _cache[55] || (_cache[55] = createBaseVNode("label", null, "平台", -1)),
                              createVNode(CustomSelect, {
                                modelValue: newLink.platform,
                                "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => newLink.platform = $event),
                                options: currentPlatformOptions.value,
                                placeholder: "请选择平台"
                              }, null, 8, ["modelValue", "options"])
                            ])) : createCommentVNode("", true),
                            newLink.linkType === "netdisk" ? (openBlock(), createElementBlock("div", _hoisted_43$1, [
                              _cache[56] || (_cache[56] = createBaseVNode("label", null, "提取码", -1)),
                              createBaseVNode("div", _hoisted_44$1, [
                                withDirectives(createBaseVNode("input", {
                                  type: "text",
                                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => newLink.extractCode = $event),
                                  placeholder: "如有提取码请填写",
                                  maxlength: "10"
                                }, null, 512), [
                                  [vModelText, newLink.extractCode]
                                ])
                              ])
                            ])) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_45$1, [
                            _cache[57] || (_cache[57] = createBaseVNode("label", null, "原文链接", -1)),
                            createBaseVNode("div", _hoisted_46$1, [
                              withDirectives(createBaseVNode("input", {
                                type: "text",
                                "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => newLink.original_url = $event),
                                placeholder: "原文链接地址（可选）"
                              }, null, 512), [
                                [vModelText, newLink.original_url]
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_47$1, [
                            createBaseVNode("div", _hoisted_48$1, [
                              _cache[58] || (_cache[58] = createBaseVNode("label", null, "文件大小", -1)),
                              createBaseVNode("div", _hoisted_49$1, [
                                withDirectives(createBaseVNode("input", {
                                  type: "text",
                                  "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => newLink.size = $event),
                                  placeholder: "如: 2.5G 或 1024M（剧集一般填写单集平均大小）",
                                  pattern: "^\\d+(\\.\\d+)?[GMgm]$",
                                  title: "请输入数字+G或M，如: 2.5G 或 1024M"
                                }, null, 512), [
                                  [vModelText, newLink.size]
                                ])
                              ])
                            ])
                          ]),
                          props.subjectCategory === "movies" || props.subjectCategory === "albums" ? (openBlock(), createElementBlock("div", _hoisted_50$1, [
                            _cache[59] || (_cache[59] = createBaseVNode("label", null, "特性标签", -1)),
                            createBaseVNode("div", _hoisted_51$1, [
                              props.subjectCategory === "movies" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                                createVNode(CheckBox, {
                                  modelValue: newLink.has_4k,
                                  "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => newLink.has_4k = $event),
                                  label: "4K画质",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: newLink.has_hdr,
                                  "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => newLink.has_hdr = $event),
                                  label: "HDR",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: newLink.has_dolby_atmos,
                                  "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => newLink.has_dolby_atmos = $event),
                                  label: "杜比全景声",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: newLink.has_subtitles,
                                  "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => newLink.has_subtitles = $event),
                                  label: "软字幕",
                                  color: "green"
                                }, null, 8, ["modelValue"])
                              ], 64)) : props.subjectCategory === "albums" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                                createVNode(CheckBox, {
                                  modelValue: newLink.is_flac,
                                  "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => newLink.is_flac = $event),
                                  label: "FLAC无损",
                                  color: "green"
                                }, null, 8, ["modelValue"]),
                                createVNode(CheckBox, {
                                  modelValue: newLink.is_wav,
                                  "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => newLink.is_wav = $event),
                                  label: "WAV无损",
                                  color: "green"
                                }, null, 8, ["modelValue"])
                              ], 64)) : createCommentVNode("", true)
                            ])
                          ])) : createCommentVNode("", true)
                        ], 32)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createBaseVNode("div", _hoisted_52$1, [
                createBaseVNode("div", _hoisted_53$1, [
                  createBaseVNode("div", _hoisted_54$1, [
                    currentLinkType.value === "netdisk" ? (openBlock(), createBlock(CustomSelect, {
                      key: 0,
                      modelValue: filter.platform,
                      "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => filter.platform = $event),
                      options: filterPlatformOptions.value,
                      placeholder: "所有平台",
                      onChange: _cache[29] || (_cache[29] = () => {
                        clearExpandedItems();
                        loadLinks();
                      })
                    }, null, 8, ["modelValue", "options"])) : createCommentVNode("", true),
                    createVNode(CustomSelect, {
                      modelValue: filter.sortBy,
                      "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => filter.sortBy = $event),
                      options: sortOptions,
                      placeholder: "按时间",
                      onChange: _cache[31] || (_cache[31] = () => {
                        clearExpandedItems();
                        loadLinks();
                      })
                    }, null, 8, ["modelValue"])
                  ]),
                  createBaseVNode("button", {
                    class: "add-link-btn-compact",
                    onClick: openAddForm,
                    disabled: !isAuthenticated2.value,
                    title: "添加链接"
                  }, _cache[60] || (_cache[60] = [
                    createBaseVNode("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 16 16",
                      fill: "currentColor"
                    }, [
                      createBaseVNode("path", { d: "M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6A.5.5 0 0 1 8 1z" })
                    ], -1)
                  ]), 8, _hoisted_55$1)
                ]),
                isAuthInitializing.value ? (openBlock(), createElementBlock("div", _hoisted_56, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(5, (n) => {
                    return createVNode(LinkItemSkeleton, {
                      key: "auth-skeleton-" + n
                    });
                  }), 64))
                ])) : isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_57, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(5, (n) => {
                    return createVNode(LinkItemSkeleton, {
                      key: "skeleton-" + n
                    });
                  }), 64))
                ])) : links.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_58, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(links.value, (link) => {
                    return openBlock(), createElementBlock("div", {
                      class: "link-item",
                      key: link.id,
                      onClick: ($event) => toggleExpanded(link.id)
                    }, [
                      createBaseVNode("div", _hoisted_60, [
                        link.platform && props.linkType !== "bt" && props.linkType !== "online" || props.linkType === "online" && getBilibiliPlatform(link.url) ? (openBlock(), createElementBlock("div", _hoisted_61, [
                          createBaseVNode("img", {
                            src: getPlatformIcon(link.platform || getBilibiliPlatform(link.url)),
                            alt: getPlatformText(link.platform || getBilibiliPlatform(link.url)),
                            class: "platform-icon"
                          }, null, 8, _hoisted_62)
                        ])) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_63, [
                          link.language ? (openBlock(), createElementBlock("span", _hoisted_64, toDisplayString(link.language), 1)) : createCommentVNode("", true),
                          link.size ? (openBlock(), createElementBlock("span", _hoisted_65, toDisplayString(link.size), 1)) : createCommentVNode("", true),
                          props.subjectCategory === "movies" && (link.has_4k || link.has_hdr || link.has_dolby_atmos || link.has_subtitles) || props.subjectCategory === "albums" && (link.is_flac || link.is_wav) ? (openBlock(), createElementBlock("div", _hoisted_66, [
                            props.subjectCategory === "movies" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                              link.has_4k ? (openBlock(), createElementBlock("span", _hoisted_67, "4K")) : createCommentVNode("", true),
                              link.has_hdr ? (openBlock(), createElementBlock("span", _hoisted_68, "HDR")) : createCommentVNode("", true),
                              link.has_dolby_atmos ? (openBlock(), createElementBlock("span", _hoisted_69, "全景声")) : createCommentVNode("", true),
                              link.has_subtitles ? (openBlock(), createElementBlock("span", _hoisted_70, "软字幕")) : createCommentVNode("", true)
                            ], 64)) : props.subjectCategory === "albums" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                              link.is_flac ? (openBlock(), createElementBlock("span", _hoisted_71, "FLAC")) : createCommentVNode("", true),
                              link.is_wav ? (openBlock(), createElementBlock("span", _hoisted_72, "WAV")) : createCommentVNode("", true)
                            ], 64)) : createCommentVNode("", true)
                          ])) : createCommentVNode("", true)
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_73, [
                        createBaseVNode("div", _hoisted_74, [
                          link.title ? (openBlock(), createElementBlock("div", {
                            key: 0,
                            class: normalizeClass(["link-title", { expanded: isExpanded(link.id) }])
                          }, toDisplayString(link.title), 3)) : createCommentVNode("", true),
                          createBaseVNode("div", {
                            class: normalizeClass(["expand-arrow", { expanded: isExpanded(link.id) }])
                          }, _cache[61] || (_cache[61] = [
                            createBaseVNode("svg", {
                              viewBox: "0 0 1024 1024",
                              width: "16",
                              height: "16"
                            }, [
                              createBaseVNode("path", {
                                d: "M512 330.666667c14.933333 0 29.866667 4.266667 40.533333 14.933333l277.33333399 234.666667c27.733333 23.466667 29.866667 64 8.53333301 89.6-23.466667 27.733333-64 29.866667-89.6 8.53333299L512 477.866667l-236.8 200.53333299c-27.733333 23.466667-68.266667 19.19999999-89.6-8.53333299-23.466667-27.733333-19.19999999-68.266667 8.53333301-89.6l277.33333399-234.666667c10.666667-10.666667 25.6-14.933333 40.533333-14.933333z",
                                fill: "currentColor"
                              })
                            ], -1)
                          ]), 2)
                        ]),
                        withDirectives(createBaseVNode("div", _hoisted_75, [
                          createBaseVNode("div", {
                            class: normalizeClass(["link-url", getLinkUrlClass(link.id)]),
                            title: getLinkStatusTooltip(link.id),
                            onClick: _cache[32] || (_cache[32] = withModifiers(() => {
                            }, ["stop"])),
                            onContextmenu: ($event) => handleLinkRightClick($event, link)
                          }, [
                            createVNode(CopyTooltip, {
                              text: link.url,
                              type: "url",
                              onCopySuccess: handleCopySuccess
                            }, null, 8, ["text"])
                          ], 42, _hoisted_76),
                          link.password ? (openBlock(), createElementBlock("div", {
                            key: 0,
                            class: "extract-code-container",
                            onClick: _cache[33] || (_cache[33] = withModifiers(() => {
                            }, ["stop"]))
                          }, [
                            _cache[62] || (_cache[62] = createBaseVNode("span", null, "提取码: ", -1)),
                            createVNode(CopyTooltip, {
                              text: link.password,
                              type: "code",
                              onCopySuccess: handleCopySuccess
                            }, null, 8, ["text"])
                          ])) : createCommentVNode("", true)
                        ], 512), [
                          [vShow, isExpanded(link.id)]
                        ])
                      ]),
                      withDirectives(createBaseVNode("div", {
                        class: "link-actions",
                        onClick: _cache[34] || (_cache[34] = withModifiers(() => {
                        }, ["stop"]))
                      }, [
                        createBaseVNode("div", _hoisted_77, [
                          createBaseVNode("button", {
                            class: normalizeClass(["vote-btn up", {
                              active: link.user_vote_type === "up",
                              pending: pendingVotes.value.has(link.id)
                            }]),
                            onClick: ($event) => handleVote(link.id, "up"),
                            disabled: !isAuthenticated2.value
                          }, [
                            (openBlock(), createElementBlock("svg", _hoisted_79, [
                              createBaseVNode("path", {
                                d: "M15 75 Q15 80 20 80 L80 80 Q85 80 85 75 Q85 70 80 65 L55 25 Q52 20 50 20 Q48 20 45 25 L20 65 Q15 70 15 75 Z",
                                fill: link.user_vote_type === "up" ? "currentColor" : "none",
                                stroke: "currentColor",
                                "stroke-width": "6",
                                "stroke-linejoin": "round"
                              }, null, 8, _hoisted_80)
                            ])),
                            createTextVNode(" " + toDisplayString(link.up_votes || 0), 1)
                          ], 10, _hoisted_78),
                          createBaseVNode("button", {
                            class: normalizeClass(["vote-btn down", {
                              active: link.user_vote_type === "down",
                              pending: pendingVotes.value.has(link.id)
                            }]),
                            onClick: ($event) => handleVote(link.id, "down"),
                            disabled: !isAuthenticated2.value
                          }, [
                            (openBlock(), createElementBlock("svg", _hoisted_82, [
                              createBaseVNode("path", {
                                d: "M15 75 Q15 80 20 80 L80 80 Q85 80 85 75 Q85 70 80 65 L55 25 Q52 20 50 20 Q48 20 45 25 L20 65 Q15 70 15 75 Z",
                                fill: link.user_vote_type === "down" ? "currentColor" : "none",
                                stroke: "currentColor",
                                "stroke-width": "6",
                                "stroke-linejoin": "round"
                              }, null, 8, _hoisted_83)
                            ])),
                            createTextVNode(" " + toDisplayString(link.down_votes || 0), 1)
                          ], 10, _hoisted_81)
                        ]),
                        createBaseVNode("div", _hoisted_84, [
                          canEditLink(link) ? (openBlock(), createElementBlock("button", {
                            key: 0,
                            class: "modify-btn",
                            onClick: ($event) => openModifyForm(link)
                          }, " 修改 ", 8, _hoisted_85)) : createCommentVNode("", true),
                          canEditLink(link) ? (openBlock(), createElementBlock("button", {
                            key: 1,
                            class: "delete-btn",
                            onClick: ($event) => handleDeleteLink(link)
                          }, " 删除 ", 8, _hoisted_86)) : createCommentVNode("", true),
                          !canEditLink(link) && isAuthenticated2.value ? (openBlock(), createElementBlock("button", {
                            key: 2,
                            class: "report-btn",
                            onClick: ($event) => showReportForm(link.id),
                            title: "反馈"
                          }, _cache[63] || (_cache[63] = [
                            createBaseVNode("svg", {
                              t: "1764658937164",
                              class: "icon",
                              viewBox: "0 0 1024 1024",
                              version: "1.1",
                              xmlns: "http://www.w3.org/2000/svg",
                              "p-id": "5403",
                              width: "16",
                              height: "16"
                            }, [
                              createBaseVNode("path", {
                                d: "M468.992 640c0-23.552 19.136-42.688 42.688-42.688H512a42.688 42.688 0 1 1 0 85.376h-0.384A42.688 42.688 0 0 1 468.992 640zM480 512a32 32 0 0 0 64 0V341.312a32 32 0 0 0-64 0V512z",
                                fill: "currentColor",
                                "p-id": "5404"
                              }),
                              createBaseVNode("path", {
                                d: "M53.312 512a458.688 458.688 0 1 1 917.376 0A458.688 458.688 0 0 1 53.312 512zM512 117.312a394.688 394.688 0 1 0 0 789.376A394.688 394.688 0 0 0 512 117.312z",
                                fill: "currentColor",
                                "p-id": "5405"
                              })
                            ], -1)
                          ]), 8, _hoisted_87)) : createCommentVNode("", true)
                        ])
                      ], 512), [
                        [vShow, isExpanded(link.id)]
                      ]),
                      withDirectives(createBaseVNode("div", _hoisted_88, [
                        createBaseVNode("div", _hoisted_89, [
                          link.original_url ? (openBlock(), createElementBlock("a", {
                            key: 0,
                            href: link.original_url,
                            target: "_blank",
                            class: "original-link",
                            title: "查看原文"
                          }, " 来源 ", 8, _hoisted_90)) : createCommentVNode("", true),
                          createBaseVNode("span", _hoisted_91, "添加by " + toDisplayString(link.user_display_name || "匿名用户"), 1)
                        ]),
                        createBaseVNode("div", _hoisted_92, [
                          createBaseVNode("span", _hoisted_93, toDisplayString(formatDate(link.created_at)), 1)
                        ])
                      ], 512), [
                        [vShow, isExpanded(link.id)]
                      ])
                    ], 8, _hoisted_59);
                  }), 128))
                ])) : !isLoading.value && !isAuthenticated2.value && links.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_94, [
                  createBaseVNode("div", { class: "login-prompt-content" }, [
                    _cache[64] || (_cache[64] = createBaseVNode("div", { class: "login-icon" }, [
                      createBaseVNode("svg", {
                        width: "48",
                        height: "48",
                        viewBox: "0 0 24 24",
                        fill: "currentColor"
                      }, [
                        createBaseVNode("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" })
                      ])
                    ], -1)),
                    _cache[65] || (_cache[65] = createBaseVNode("h3", null, "登录后浏览链接", -1)),
                    _cache[66] || (_cache[66] = createBaseVNode("p", null, "登录后即可查看和添加资源链接", -1)),
                    createBaseVNode("button", {
                      class: "login-btn",
                      onClick: scrollToUserSection
                    }, " 立即登录 ")
                  ])
                ])) : !isLoading.value && links.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_95, _cache[67] || (_cache[67] = [
                  createBaseVNode("svg", {
                    t: "1764598239071",
                    class: "empty-state-icon",
                    viewBox: "0 0 1024 1024",
                    version: "1.1",
                    xmlns: "http://www.w3.org/2000/svg",
                    "p-id": "5284",
                    width: "200",
                    height: "200"
                  }, [
                    createBaseVNode("path", {
                      d: "M648.54016 716.8a34.14016 34.14016 0 0 1 34.11968 34.14016v136.54016a34.11968 34.11968 0 0 1-68.25984 0v-136.54016A34.14016 34.14016 0 0 1 648.54016 716.8z m-310.6816-251.45344a34.14016 34.14016 0 0 1 0 48.25088l-131.46112 131.4816a121.99936 121.99936 0 0 0 172.544 172.52352l131.46112-131.4816a34.14016 34.14016 0 0 1 48.25088 48.29184L427.2128 865.8944A190.2592 190.2592 0 0 1 158.1056 596.7872l131.46112-131.44064a34.11968 34.11968 0 0 1 48.27136 0z m451.33824 275.57888l96.5632 96.58368a34.11968 34.11968 0 0 1-48.25088 48.25088l-96.5632-96.5632a34.0992 34.0992 0 0 1-0.43008-48.68096 34.14016 34.14016 0 0 1 48.68096 0.4096zM887.48032 614.4a34.11968 34.11968 0 0 1 0 68.28032h-136.54016a34.14016 34.14016 0 0 1 0-68.28032h136.54016zM865.87392 158.14656a190.2592 190.2592 0 0 1 0 269.06624L734.4128 558.6944a34.11968 34.11968 0 1 1-48.27136-48.27136l131.46112-131.4816a121.99936 121.99936 0 0 0-172.544-172.52352l-131.46112 131.4816a34.14016 34.14016 0 1 1-48.25088-48.29184l131.44064-131.44064a190.2592 190.2592 0 0 1 269.08672 0z m-592.81408 183.1936a34.14016 34.14016 0 0 1 0 68.25984H136.51968a34.14016 34.14016 0 0 1 0-68.25984h136.54016z m-64.14336-180.67456l96.5632 96.5632a34.14016 34.14016 0 0 1-48.25088 48.27136L160.6656 208.896A34.11968 34.11968 0 1 1 208.896 160.62464v0.04096zM375.48032 102.4A34.14016 34.14016 0 0 1 409.6 136.54016v136.51968a34.14016 34.14016 0 0 1-68.25984 0V136.54016A34.14016 34.14016 0 0 1 375.45984 102.4z",
                      fill: "#AE97F1",
                      opacity: ".7",
                      "p-id": "5285"
                    })
                  ], -1),
                  createBaseVNode("p", null, "暂无链接，成为第一个添加链接的人吧！", -1)
                ]))) : createCommentVNode("", true),
                isAuthenticated2.value && !isLoading.value && !isAuthInitializing.value && links.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_96, [
                  createBaseVNode("button", {
                    class: normalizeClass(["seek-btn", { "active": userSeekStatus.value[currentSeekKey.value], "seeking": isSeeking.value }]),
                    onClick: handleSeekResource,
                    disabled: userSeekStatus.value[currentSeekKey.value] || isSeeking.value
                  }, [
                    isSeeking.value ? (openBlock(), createElementBlock("span", _hoisted_98)) : createCommentVNode("", true),
                    createBaseVNode("span", null, toDisplayString(isSeeking.value ? "提交中..." : userSeekStatus.value[currentSeekKey.value] ? "已求资源，晚点再来看吧" : "求资源"), 1)
                  ], 10, _hoisted_97),
                  createBaseVNode("p", _hoisted_99, " 已有 " + toDisplayString(seekerStats.value[currentSeekKey.value] || 0) + " 人正在求此资源 ", 1)
                ])) : createCommentVNode("", true)
              ]),
              pagination.value.pages > 1 && !isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_100, [
                createBaseVNode("button", {
                  class: "pagination-btn",
                  disabled: pagination.value.page <= 1,
                  onClick: goToPrevPage
                }, " 上一页 ", 8, _hoisted_101),
                createBaseVNode("span", _hoisted_102, toDisplayString(pagination.value.page) + " / " + toDisplayString(pagination.value.pages), 1),
                createBaseVNode("button", {
                  class: "pagination-btn",
                  disabled: pagination.value.page >= pagination.value.pages,
                  onClick: goToNextPage
                }, " 下一页 ", 8, _hoisted_103)
              ])) : createCommentVNode("", true),
              createVNode(ToastContainer, {
                "error-message": error2.value,
                "success-message": successMessage.value,
                duration: 3e3,
                "auto-close": true,
                onClearError: _cache[35] || (_cache[35] = ($event) => error2.value = ""),
                onClearSuccess: _cache[36] || (_cache[36] = ($event) => successMessage.value = "")
              }, null, 8, ["error-message", "success-message"])
            ]),
            createVNode(Transition, { name: "modal" }, {
              default: withCtx(() => [
                showDeleteModal.value ? (openBlock(), createElementBlock("div", _hoisted_104, [
                  createBaseVNode("div", _hoisted_105, [
                    createBaseVNode("div", { class: "modal-header" }, [
                      createBaseVNode("button", {
                        class: "close-btn",
                        onClick: closeDeleteModal
                      }, _cache[68] || (_cache[68] = [
                        createBaseVNode("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          createBaseVNode("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })
                        ], -1)
                      ]))
                    ]),
                    createBaseVNode("div", _hoisted_106, [
                      _cache[69] || (_cache[69] = createBaseVNode("div", { class: "delete-confirmation" }, [
                        createBaseVNode("div", { class: "warning-icon" }, "⚠️"),
                        createBaseVNode("p", null, "确定要删除这个链接吗？"),
                        createBaseVNode("p", { class: "warning-text" }, "此操作不可撤销")
                      ], -1)),
                      createBaseVNode("div", _hoisted_107, [
                        createBaseVNode("button", {
                          type: "button",
                          class: "delete-confirm-btn",
                          disabled: isDeleting.value,
                          onClick: confirmDeleteLink
                        }, toDisplayString(isDeleting.value ? "删除中..." : "确认删除"), 9, _hoisted_108),
                        createBaseVNode("button", {
                          type: "button",
                          onClick: closeDeleteModal
                        }, " 取消 ")
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            }),
            createVNode(Transition, { name: "modal" }, {
              default: withCtx(() => [
                showReportModal.value ? (openBlock(), createElementBlock("div", _hoisted_109, [
                  createBaseVNode("div", _hoisted_110, [
                    createBaseVNode("div", { class: "modal-header" }, [
                      createBaseVNode("button", {
                        class: "close-btn",
                        onClick: closeReportModal
                      }, _cache[70] || (_cache[70] = [
                        createBaseVNode("svg", {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          createBaseVNode("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" })
                        ], -1)
                      ]))
                    ]),
                    createBaseVNode("div", _hoisted_111, [
                      createBaseVNode("form", {
                        onSubmit: withModifiers(handleReportSubmit, ["prevent"])
                      }, [
                        createBaseVNode("div", _hoisted_112, [
                          _cache[71] || (_cache[71] = createBaseVNode("label", { for: "report-type" }, "反馈类型 *", -1)),
                          createVNode(CustomSelect, {
                            id: "report-type",
                            modelValue: reportForm.type,
                            "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => reportForm.type = $event),
                            options: reportReasons,
                            placeholder: "请选择反馈类型",
                            required: ""
                          }, null, 8, ["modelValue"])
                        ]),
                        createBaseVNode("div", _hoisted_113, [
                          _cache[72] || (_cache[72] = createBaseVNode("label", { for: "report-reason" }, "详细原因", -1)),
                          createBaseVNode("div", _hoisted_114, [
                            withDirectives(createBaseVNode("input", {
                              id: "report-reason",
                              "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => reportForm.reason = $event),
                              placeholder: "请详细描述反馈原因（可选）",
                              rows: "4"
                            }, null, 512), [
                              [vModelText, reportForm.reason]
                            ])
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_115, [
                          createBaseVNode("button", {
                            type: "submit",
                            disabled: isSubmittingReport.value || !reportForm.type
                          }, toDisplayString(isSubmittingReport.value ? "提交中..." : "提交反馈"), 9, _hoisted_116),
                          createBaseVNode("button", {
                            type: "button",
                            onClick: closeReportModal
                          }, " 取消 ")
                        ])
                      ], 32)
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ], 64);
        };
      }
    };
    const LinkManager = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-19f7b367"]]);
    const LinkManager$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: LinkManager
    }, Symbol.toStringTag, { value: "Module" }));
    const _hoisted_1$3 = { class: "auth-switch" };
    const _hoisted_2$3 = { class: "switch-container" };
    const _hoisted_3$3 = ["checked"];
    const _hoisted_4$3 = ["checked"];
    const _sfc_main$3 = {
      __name: "AuthSwitch",
      props: {
        modelValue: {
          type: String,
          default: "login"
        }
      },
      emits: ["update:modelValue"],
      setup(__props, { emit: __emit }) {
        const props = __props;
        const sliderPosition = computed(() => {
          return props.modelValue === "login" ? "2%" : "52%";
        });
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", _hoisted_1$3, [
            createBaseVNode("div", _hoisted_2$3, [
              createBaseVNode("input", {
                id: "login",
                type: "radio",
                name: "authMode",
                value: "login",
                checked: __props.modelValue === "login",
                onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", "login")),
                class: "switch-input"
              }, null, 40, _hoisted_3$3),
              _cache[2] || (_cache[2] = createBaseVNode("label", {
                for: "login",
                class: "switch-label"
              }, "登录", -1)),
              createBaseVNode("input", {
                id: "register",
                type: "radio",
                name: "authMode",
                value: "register",
                checked: __props.modelValue === "register",
                onChange: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:modelValue", "register")),
                class: "switch-input"
              }, null, 40, _hoisted_4$3),
              _cache[3] || (_cache[3] = createBaseVNode("label", {
                for: "register",
                class: "switch-label"
              }, "注册", -1)),
              createBaseVNode("div", {
                class: "slider",
                style: normalizeStyle({ left: sliderPosition.value })
              }, null, 4)
            ])
          ]);
        };
      }
    };
    const AuthSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-d47a81a4"]]);
    const _hoisted_1$2 = { class: "auth-container" };
    const _hoisted_2$2 = {
      key: 0,
      class: "initializing-container"
    };
    const _hoisted_3$2 = {
      key: 1,
      class: "user-info"
    };
    const _hoisted_4$2 = { class: "user-header" };
    const _hoisted_5$2 = { class: "user-details" };
    const _hoisted_6$2 = { class: "user-display-name" };
    const _hoisted_7$2 = {
      key: 0,
      class: "user-email"
    };
    const _hoisted_8$2 = { class: "user-stats" };
    const _hoisted_9$2 = { class: "stat-item" };
    const _hoisted_10$2 = { class: "stat-value" };
    const _hoisted_11$2 = { class: "stat-item" };
    const _hoisted_12$2 = { class: "stat-value" };
    const _hoisted_13$2 = {
      key: 0,
      class: "nickname-edit-form"
    };
    const _hoisted_14$2 = { class: "form-group" };
    const _hoisted_15$2 = { class: "nickname-actions" };
    const _hoisted_16 = ["disabled"];
    const _hoisted_17 = {
      key: 2,
      class: "auth-forms"
    };
    const _hoisted_18 = {
      key: 1,
      class: "back-button"
    };
    const _hoisted_19 = { class: "form-group" };
    const _hoisted_20 = { class: "input-wrapper" };
    const _hoisted_21 = { class: "form-group" };
    const _hoisted_22 = { class: "input-wrapper" };
    const _hoisted_23 = ["disabled"];
    const _hoisted_24 = { class: "forgot-password-link" };
    const _hoisted_25 = { class: "form-group" };
    const _hoisted_26 = { class: "form-group" };
    const _hoisted_27 = { class: "form-group" };
    const _hoisted_28 = { class: "input-wrapper password-wrapper" };
    const _hoisted_29 = ["type"];
    const _hoisted_30 = {
      key: 0,
      viewBox: "0 0 24 24",
      width: "16",
      height: "16",
      fill: "currentColor"
    };
    const _hoisted_31 = {
      key: 1,
      viewBox: "0 0 24 24",
      width: "16",
      height: "16",
      fill: "currentColor"
    };
    const _hoisted_32 = { class: "form-group" };
    const _hoisted_33 = { class: "input-wrapper password-wrapper" };
    const _hoisted_34 = ["type"];
    const _hoisted_35 = {
      key: 0,
      viewBox: "0 0 24 24",
      width: "16",
      height: "16",
      fill: "currentColor"
    };
    const _hoisted_36 = {
      key: 1,
      viewBox: "0 0 24 24",
      width: "16",
      height: "16",
      fill: "currentColor"
    };
    const _hoisted_37 = {
      key: 0,
      class: "proof-progress"
    };
    const _hoisted_38 = { class: "progress-bar" };
    const _hoisted_39 = ["disabled"];
    const _hoisted_40 = { class: "form-description" };
    const _hoisted_41 = { class: "form-group" };
    const _hoisted_42 = ["readonly"];
    const _hoisted_43 = { class: "form-group" };
    const _hoisted_44 = ["disabled"];
    const _hoisted_45 = { class: "resend-code" };
    const _hoisted_46 = ["disabled"];
    const _hoisted_47 = { class: "form-group" };
    const _hoisted_48 = {
      key: 0,
      class: "proof-progress"
    };
    const _hoisted_49 = { class: "progress-bar" };
    const _hoisted_50 = ["disabled"];
    const _hoisted_51 = { class: "form-group" };
    const _hoisted_52 = { class: "form-group" };
    const _hoisted_53 = { class: "form-group" };
    const _hoisted_54 = { class: "form-group" };
    const _hoisted_55 = ["disabled"];
    const _sfc_main$2 = {
      __name: "AuthComponent",
      setup(__props) {
        const user2 = ref(null);
        const userProfile = ref(null);
        const authMode = ref("login");
        const loading2 = ref(false);
        ref("");
        ref("");
        const isEditingNickname = ref(false);
        const isInitializing = ref(true);
        const showRegisterPassword = ref(false);
        const showRegisterConfirmPassword = ref(false);
        const toastError = ref("");
        const toastSuccess = ref("");
        const loginForm = ref({
          email: "",
          password: ""
        });
        onUnmounted(() => {
          if (stopWatching) {
            stopWatching();
          }
        });
        const registerForm = ref({
          email: "",
          password: "",
          confirmPassword: "",
          username: ""
        });
        const verifyEmailForm = ref({
          email: "",
          code: ""
        });
        const forgotPasswordForm = ref({
          email: ""
        });
        const resetPasswordForm = ref({
          email: "",
          code: "",
          password: "",
          confirmPassword: ""
        });
        const isComputingProof = ref(false);
        const proofProgress = ref(0);
        const pendingVerificationEmail = ref("");
        const usernameForm = ref({
          username: ""
        });
        onMounted(async () => {
          try {
            await userStore$1.initAuth();
            user2.value = userStore$1.user.value;
            if (user2.value) {
              await loadUserProfile();
            }
            const stopWatching2 = watch(() => userStore$1.user.value, (newUser) => {
              user2.value = newUser;
              if (newUser) {
                loadUserProfile();
              } else {
                userProfile.value = null;
              }
            }, { immediate: false });
          } finally {
            isInitializing.value = false;
          }
        });
        const clearMessages = () => {
          toastError.value = "";
          toastSuccess.value = "";
        };
        const loadUserProfile = async () => {
          if (!user2.value) return;
          try {
            const userData = await authAPI.getCurrentUser();
            if (userData) {
              userProfile.value = userData;
              console.log("用户资料数据:", userData);
            } else {
              console.error("获取用户数据失败");
            }
          } catch (err) {
            console.error("加载用户资料异常:", err);
          }
        };
        const toggleNicknameEdit = () => {
          var _a;
          isEditingNickname.value = !isEditingNickname.value;
          if (isEditingNickname.value) {
            usernameForm.value.username = ((_a = user2.value) == null ? void 0 : _a.username) || "";
          }
          clearMessages();
        };
        const handleSaveNickname = async () => {
          var _a, _b;
          if (!user2.value) return;
          clearMessages();
          loading2.value = true;
          try {
            const username = usernameForm.value.username.trim();
            if (!username) {
              toastError.value = "用户名不能为空";
              return;
            }
            if (username.length < 2 || username.length > 10) {
              toastError.value = "用户名长度必须在2-10个字符之间";
              return;
            }
            const response = await userAPI.updateUserName({
              username
            });
            if (response.success) {
              const updatedUser = { ...user2.value, ...response.data };
              user2.value = updatedUser;
              userStore$1.user.value = updatedUser;
              toastSuccess.value = response.message || "用户名更新成功！";
              isEditingNickname.value = false;
              await loadUserProfile();
            } else {
              toastError.value = response.message || "更新用户名失败";
            }
          } catch (err) {
            console.error("更新用户名错误:", err);
            if ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) {
              toastError.value = err.response.data.message;
            } else {
              toastError.value = "更新用户名失败，请稍后重试";
            }
          } finally {
            loading2.value = false;
          }
        };
        const handleSignIn = async () => {
          clearMessages();
          loading2.value = true;
          try {
            const result = await userStore$1.signIn(
              loginForm.value.email,
              loginForm.value.password
            );
            if (result.success) {
              user2.value = result.user;
              toastSuccess.value = "登录成功！";
              loginForm.value = { email: "", password: "" };
              await loadUserProfile();
            } else {
              toastError.value = result.error || "登录失败，请检查邮箱和密码";
            }
          } catch (err) {
            toastError.value = "登录过程中发生错误";
            console.error("登录错误:", err);
          } finally {
            loading2.value = false;
          }
        };
        const handleSignUp = async () => {
          clearMessages();
          if (registerForm.value.password !== registerForm.value.confirmPassword) {
            toastError.value = "两次输入的密码不一致";
            return;
          }
          loading2.value = true;
          try {
            const result = await userStore$1.signUpWithProof(registerForm.value, (progress) => {
              isComputingProof.value = true;
              proofProgress.value = progress;
            });
            isComputingProof.value = false;
            proofProgress.value = 0;
            if (result.success) {
              pendingVerificationEmail.value = registerForm.value.email;
              verifyEmailForm.value.email = registerForm.value.email;
              authMode.value = "verify-email";
              toastSuccess.value = "注册成功！请查收邮件并验证邮箱";
              registerForm.value = { email: "", password: "", confirmPassword: "", username: "" };
            } else {
              toastError.value = result.error || "注册失败，请稍后重试";
            }
          } catch (err) {
            isComputingProof.value = false;
            proofProgress.value = 0;
            toastError.value = "注册过程中发生错误";
            console.error("注册错误:", err);
          } finally {
            loading2.value = false;
          }
        };
        const handleVerifyEmail = async () => {
          clearMessages();
          loading2.value = true;
          try {
            const result = await userStore$1.verifyEmail(verifyEmailForm.value.email, verifyEmailForm.value.code);
            if (result.success) {
              toastSuccess.value = "邮箱验证成功！请登录";
              authMode.value = "login";
              verifyEmailForm.value = { email: "", code: "" };
              pendingVerificationEmail.value = "";
            } else {
              toastError.value = result.error || "验证失败，请重试";
            }
          } catch (err) {
            toastError.value = "验证过程中发生错误";
            console.error("验证错误:", err);
          } finally {
            loading2.value = false;
          }
        };
        const handleResendCode = async () => {
          clearMessages();
          loading2.value = true;
          try {
            const email = verifyEmailForm.value.email || pendingVerificationEmail.value;
            const result = await userStore$1.resendVerificationCode(email, (progress) => {
              console.log("重发验证码进度:", progress);
            });
            if (result.success) {
              toastSuccess.value = "验证码已重新发送，请查收邮件";
            } else {
              toastError.value = result.error || "发送失败，请重试";
            }
          } catch (err) {
            toastError.value = "发送过程中发生错误";
            console.error("重发验证码错误:", err);
          } finally {
            loading2.value = false;
          }
        };
        const handleForgotPassword = async () => {
          clearMessages();
          loading2.value = true;
          try {
            const result = await userStore$1.forgotPassword(forgotPasswordForm.value.email, (progress) => {
              isComputingProof.value = true;
              proofProgress.value = progress;
            });
            isComputingProof.value = false;
            proofProgress.value = 0;
            if (result.success) {
              resetPasswordForm.value.email = forgotPasswordForm.value.email;
              authMode.value = "reset-password";
              toastSuccess.value = "重置码已发送，请查收邮件";
              forgotPasswordForm.value = { email: "" };
            } else {
              toastError.value = result.error || "发送失败，请重试";
            }
          } catch (err) {
            isComputingProof.value = false;
            proofProgress.value = 0;
            toastError.value = "发送过程中发生错误";
            console.error("忘记密码错误:", err);
          } finally {
            loading2.value = false;
          }
        };
        const handleResetPassword = async () => {
          clearMessages();
          if (resetPasswordForm.value.password !== resetPasswordForm.value.confirmPassword) {
            toastError.value = "两次输入的密码不一致";
            return;
          }
          loading2.value = true;
          try {
            const result = await userStore$1.resetPassword(
              resetPasswordForm.value.email,
              resetPasswordForm.value.code,
              resetPasswordForm.value.password
            );
            if (result.success) {
              toastSuccess.value = "密码重置成功！请使用新密码登录";
              authMode.value = "login";
              resetPasswordForm.value = { email: "", code: "", password: "", confirmPassword: "" };
            } else {
              toastError.value = result.error || "重置失败，请重试";
            }
          } catch (err) {
            toastError.value = "重置过程中发生错误";
            console.error("重置密码错误:", err);
          } finally {
            loading2.value = false;
          }
        };
        const goBackToLogin = () => {
          authMode.value = "login";
          clearMessages();
        };
        const handleSignOut = () => {
          userStore$1.signOut();
          toastSuccess.value = "已成功登出";
          user2.value = null;
          userProfile.value = null;
        };
        return (_ctx, _cache) => {
          return openBlock(), createElementBlock("div", _hoisted_1$2, [
            isInitializing.value ? (openBlock(), createElementBlock("div", _hoisted_2$2, _cache[20] || (_cache[20] = [
              createBaseVNode("div", { class: "loading-spinner" }, null, -1),
              createBaseVNode("p", null, "加载中...", -1)
            ]))) : user2.value ? (openBlock(), createElementBlock("div", _hoisted_3$2, [
              createBaseVNode("div", _hoisted_4$2, [
                createBaseVNode("div", _hoisted_5$2, [
                  createBaseVNode("div", _hoisted_6$2, toDisplayString(user2.value.username || user2.value.email), 1),
                  user2.value.username ? (openBlock(), createElementBlock("div", _hoisted_7$2, toDisplayString(user2.value.email), 1)) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_8$2, [
                    createBaseVNode("span", _hoisted_9$2, [
                      _cache[21] || (_cache[21] = createBaseVNode("span", { class: "stat-icon" }, [
                        createBaseVNode("svg", {
                          viewBox: "0 0 100 100",
                          xmlns: "http://www.w3.org/2000/svg"
                        }, [
                          createBaseVNode("path", {
                            d: "M15 75 Q15 80 20 80 L80 80 Q85 80 85 75 Q85 70 80 65 L55 25 Q52 20 50 20 Q48 20 45 25 L20 65 Q15 70 15 75 Z",
                            fill: "currentColor",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            "stroke-linejoin": "round"
                          })
                        ])
                      ], -1)),
                      createBaseVNode("span", _hoisted_10$2, toDisplayString(userProfile.value && userProfile.value.data && userProfile.value.data.total_likes || 0), 1)
                    ]),
                    createBaseVNode("span", _hoisted_11$2, [
                      _cache[22] || (_cache[22] = createBaseVNode("span", { class: "stat-icon down-icon" }, [
                        createBaseVNode("svg", {
                          viewBox: "0 0 100 100",
                          xmlns: "http://www.w3.org/2000/svg"
                        }, [
                          createBaseVNode("path", {
                            d: "M15 75 Q15 80 20 80 L80 80 Q85 80 85 75 Q85 70 80 65 L55 25 Q52 20 50 20 Q48 20 45 25 L20 65 Q15 70 15 75 Z",
                            fill: "currentColor",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            "stroke-linejoin": "round"
                          })
                        ])
                      ], -1)),
                      createBaseVNode("span", _hoisted_12$2, toDisplayString(userProfile.value && userProfile.value.data && userProfile.value.data.total_dislikes || 0), 1)
                    ])
                  ])
                ]),
                createBaseVNode("button", {
                  onClick: toggleNicknameEdit,
                  class: "edit-nickname-btn"
                }, toDisplayString(isEditingNickname.value ? "取消" : "编辑用户名"), 1)
              ]),
              isEditingNickname.value ? (openBlock(), createElementBlock("div", _hoisted_13$2, [
                createBaseVNode("div", _hoisted_14$2, [
                  _cache[23] || (_cache[23] = createBaseVNode("label", null, "用户名", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => usernameForm.value.username = $event),
                    type: "text",
                    placeholder: "请输入用户名",
                    class: "form-input",
                    maxlength: "10"
                  }, null, 512), [
                    [vModelText, usernameForm.value.username]
                  ]),
                  _cache[24] || (_cache[24] = createBaseVNode("div", { class: "nickname-hint" }, "用户名长度为2-10个字符", -1))
                ]),
                createBaseVNode("div", _hoisted_15$2, [
                  createBaseVNode("button", {
                    onClick: handleSaveNickname,
                    disabled: loading2.value,
                    class: "save-nickname-btn"
                  }, toDisplayString(loading2.value ? "保存中..." : "保存"), 9, _hoisted_16),
                  createBaseVNode("button", {
                    onClick: toggleNicknameEdit,
                    class: "cancel-nickname-btn"
                  }, " 取消 ")
                ])
              ])) : createCommentVNode("", true),
              createBaseVNode("button", {
                onClick: handleSignOut,
                class: "sign-out-btn"
              }, " 退出登录 "),
              _cache[25] || (_cache[25] = createBaseVNode("div", { class: "about-section" }, [
                createBaseVNode("a", {
                  href: "https://hifasgfcasxgvc.doubanflix.com/about",
                  target: "_blank",
                  class: "about-link"
                }, "关于 DoubanFlix")
              ], -1))
            ])) : (openBlock(), createElementBlock("div", _hoisted_17, [
              !["verify-email", "forgot-password", "reset-password"].includes(authMode.value) ? (openBlock(), createBlock(AuthSwitch, {
                key: 0,
                modelValue: authMode.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => authMode.value = $event)
              }, null, 8, ["modelValue"])) : createCommentVNode("", true),
              ["verify-email", "forgot-password", "reset-password"].includes(authMode.value) ? (openBlock(), createElementBlock("div", _hoisted_18, [
                createBaseVNode("button", {
                  onClick: goBackToLogin,
                  class: "back-btn"
                }, " ← 返回登录 ")
              ])) : createCommentVNode("", true),
              authMode.value === "login" ? (openBlock(), createElementBlock("form", {
                key: 2,
                onSubmit: withModifiers(handleSignIn, ["prevent"]),
                class: "auth-form",
                "data-mode": "login"
              }, [
                createBaseVNode("div", _hoisted_19, [
                  _cache[26] || (_cache[26] = createBaseVNode("label", null, "邮箱", -1)),
                  createBaseVNode("div", _hoisted_20, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => loginForm.value.email = $event),
                      type: "email",
                      required: "",
                      placeholder: "请输入邮箱",
                      class: "form-input"
                    }, null, 512), [
                      [vModelText, loginForm.value.email]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_21, [
                  _cache[27] || (_cache[27] = createBaseVNode("label", null, "密码", -1)),
                  createBaseVNode("div", _hoisted_22, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => loginForm.value.password = $event),
                      type: "password",
                      required: "",
                      placeholder: "请输入密码",
                      class: "form-input"
                    }, null, 512), [
                      [vModelText, loginForm.value.password]
                    ])
                  ])
                ]),
                createBaseVNode("button", {
                  type: "submit",
                  disabled: loading2.value,
                  class: "auth-submit-btn"
                }, toDisplayString(loading2.value ? "登录中..." : "登录"), 9, _hoisted_23),
                createBaseVNode("div", _hoisted_24, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: _cache[4] || (_cache[4] = ($event) => authMode.value = "forgot-password"),
                    class: "link-btn"
                  }, " 忘记密码？ ")
                ])
              ], 32)) : createCommentVNode("", true),
              authMode.value === "register" ? (openBlock(), createElementBlock("form", {
                key: 3,
                onSubmit: withModifiers(handleSignUp, ["prevent"]),
                class: "auth-form",
                "data-mode": "register"
              }, [
                createBaseVNode("div", _hoisted_25, [
                  _cache[28] || (_cache[28] = createBaseVNode("label", null, "用户名", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => registerForm.value.username = $event),
                    type: "text",
                    required: "",
                    placeholder: "3-10个字符",
                    class: "form-input",
                    minlength: "3",
                    maxlength: "10"
                  }, null, 512), [
                    [vModelText, registerForm.value.username]
                  ])
                ]),
                createBaseVNode("div", _hoisted_26, [
                  _cache[29] || (_cache[29] = createBaseVNode("label", null, "邮箱", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => registerForm.value.email = $event),
                    type: "email",
                    required: "",
                    placeholder: "请输入邮箱",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, registerForm.value.email]
                  ])
                ]),
                createBaseVNode("div", _hoisted_27, [
                  _cache[32] || (_cache[32] = createBaseVNode("label", null, "密码", -1)),
                  createBaseVNode("div", _hoisted_28, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => registerForm.value.password = $event),
                      type: showRegisterPassword.value ? "text" : "password",
                      required: "",
                      placeholder: "至少6位",
                      class: "form-input with-icon",
                      minlength: "6"
                    }, null, 8, _hoisted_29), [
                      [vModelDynamic, registerForm.value.password]
                    ]),
                    createBaseVNode("button", {
                      type: "button",
                      class: "eye-btn",
                      onClick: _cache[8] || (_cache[8] = ($event) => showRegisterPassword.value = !showRegisterPassword.value),
                      tabindex: "-1"
                    }, [
                      showRegisterPassword.value ? (openBlock(), createElementBlock("svg", _hoisted_30, _cache[30] || (_cache[30] = [
                        createBaseVNode("path", { d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }, null, -1)
                      ]))) : (openBlock(), createElementBlock("svg", _hoisted_31, _cache[31] || (_cache[31] = [
                        createBaseVNode("path", { d: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" }, null, -1)
                      ])))
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_32, [
                  _cache[35] || (_cache[35] = createBaseVNode("label", null, "确认密码", -1)),
                  createBaseVNode("div", _hoisted_33, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => registerForm.value.confirmPassword = $event),
                      type: showRegisterConfirmPassword.value ? "text" : "password",
                      required: "",
                      placeholder: "请再次输入密码",
                      class: "form-input with-icon"
                    }, null, 8, _hoisted_34), [
                      [vModelDynamic, registerForm.value.confirmPassword]
                    ]),
                    createBaseVNode("button", {
                      type: "button",
                      class: "eye-btn",
                      onClick: _cache[10] || (_cache[10] = ($event) => showRegisterConfirmPassword.value = !showRegisterConfirmPassword.value),
                      tabindex: "-1"
                    }, [
                      showRegisterConfirmPassword.value ? (openBlock(), createElementBlock("svg", _hoisted_35, _cache[33] || (_cache[33] = [
                        createBaseVNode("path", { d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }, null, -1)
                      ]))) : (openBlock(), createElementBlock("svg", _hoisted_36, _cache[34] || (_cache[34] = [
                        createBaseVNode("path", { d: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" }, null, -1)
                      ])))
                    ])
                  ])
                ]),
                isComputingProof.value ? (openBlock(), createElementBlock("div", _hoisted_37, [
                  _cache[36] || (_cache[36] = createBaseVNode("div", { class: "progress-text" }, "正在计算工作量证明...", -1)),
                  createBaseVNode("div", _hoisted_38, [
                    createBaseVNode("div", {
                      class: "progress-fill",
                      style: normalizeStyle({ width: Math.min(proofProgress.value / 1e3, 100) + "%" })
                    }, null, 4)
                  ])
                ])) : createCommentVNode("", true),
                createBaseVNode("button", {
                  type: "submit",
                  disabled: loading2.value || isComputingProof.value,
                  class: "auth-submit-btn"
                }, toDisplayString(isComputingProof.value ? "计算中..." : loading2.value ? "注册中..." : "注册"), 9, _hoisted_39)
              ], 32)) : createCommentVNode("", true),
              authMode.value === "verify-email" ? (openBlock(), createElementBlock("form", {
                key: 4,
                onSubmit: withModifiers(handleVerifyEmail, ["prevent"]),
                class: "auth-form"
              }, [
                _cache[39] || (_cache[39] = createBaseVNode("div", { class: "form-title" }, "邮箱验证", -1)),
                createBaseVNode("div", _hoisted_40, " 我们已向 " + toDisplayString(pendingVerificationEmail.value || verifyEmailForm.value.email) + " 发送了验证码，请查收邮件并输入验证码。 ", 1),
                createBaseVNode("div", _hoisted_41, [
                  _cache[37] || (_cache[37] = createBaseVNode("label", null, "邮箱", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => verifyEmailForm.value.email = $event),
                    type: "email",
                    required: "",
                    placeholder: "请输入邮箱",
                    class: "form-input",
                    readonly: !!pendingVerificationEmail.value
                  }, null, 8, _hoisted_42), [
                    [vModelText, verifyEmailForm.value.email]
                  ])
                ]),
                createBaseVNode("div", _hoisted_43, [
                  _cache[38] || (_cache[38] = createBaseVNode("label", null, "验证码", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => verifyEmailForm.value.code = $event),
                    type: "text",
                    required: "",
                    placeholder: "请输入6位验证码",
                    class: "form-input",
                    maxlength: "6"
                  }, null, 512), [
                    [vModelText, verifyEmailForm.value.code]
                  ])
                ]),
                createBaseVNode("button", {
                  type: "submit",
                  disabled: loading2.value,
                  class: "auth-submit-btn"
                }, toDisplayString(loading2.value ? "验证中..." : "验证邮箱"), 9, _hoisted_44),
                createBaseVNode("div", _hoisted_45, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: handleResendCode,
                    disabled: loading2.value,
                    class: "link-btn"
                  }, " 重新发送验证码 ", 8, _hoisted_46)
                ])
              ], 32)) : createCommentVNode("", true),
              authMode.value === "forgot-password" ? (openBlock(), createElementBlock("form", {
                key: 5,
                onSubmit: withModifiers(handleForgotPassword, ["prevent"]),
                class: "auth-form"
              }, [
                _cache[42] || (_cache[42] = createBaseVNode("div", { class: "form-title" }, "忘记密码", -1)),
                _cache[43] || (_cache[43] = createBaseVNode("div", { class: "form-description" }, " 请输入您的邮箱地址，我们将向您发送重置密码的验证码。 ", -1)),
                createBaseVNode("div", _hoisted_47, [
                  _cache[40] || (_cache[40] = createBaseVNode("label", null, "邮箱", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => forgotPasswordForm.value.email = $event),
                    type: "email",
                    required: "",
                    placeholder: "请输入注册时使用的邮箱",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, forgotPasswordForm.value.email]
                  ])
                ]),
                isComputingProof.value ? (openBlock(), createElementBlock("div", _hoisted_48, [
                  _cache[41] || (_cache[41] = createBaseVNode("div", { class: "progress-text" }, "正在计算工作量证明...", -1)),
                  createBaseVNode("div", _hoisted_49, [
                    createBaseVNode("div", {
                      class: "progress-fill",
                      style: normalizeStyle({ width: Math.min(proofProgress.value / 1e3, 100) + "%" })
                    }, null, 4)
                  ])
                ])) : createCommentVNode("", true),
                createBaseVNode("button", {
                  type: "submit",
                  disabled: loading2.value || isComputingProof.value,
                  class: "auth-submit-btn"
                }, toDisplayString(isComputingProof.value ? "计算中..." : loading2.value ? "发送中..." : "发送重置码"), 9, _hoisted_50)
              ], 32)) : createCommentVNode("", true),
              authMode.value === "reset-password" ? (openBlock(), createElementBlock("form", {
                key: 6,
                onSubmit: withModifiers(handleResetPassword, ["prevent"]),
                class: "auth-form"
              }, [
                _cache[48] || (_cache[48] = createBaseVNode("div", { class: "form-title" }, "重置密码", -1)),
                _cache[49] || (_cache[49] = createBaseVNode("div", { class: "form-description" }, " 请输入您收到的验证码和新密码。 ", -1)),
                createBaseVNode("div", _hoisted_51, [
                  _cache[44] || (_cache[44] = createBaseVNode("label", null, "邮箱", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => resetPasswordForm.value.email = $event),
                    type: "email",
                    required: "",
                    placeholder: "请输入邮箱",
                    class: "form-input",
                    readonly: ""
                  }, null, 512), [
                    [vModelText, resetPasswordForm.value.email]
                  ])
                ]),
                createBaseVNode("div", _hoisted_52, [
                  _cache[45] || (_cache[45] = createBaseVNode("label", null, "验证码", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => resetPasswordForm.value.code = $event),
                    type: "text",
                    required: "",
                    placeholder: "请输入6位验证码",
                    class: "form-input",
                    maxlength: "6"
                  }, null, 512), [
                    [vModelText, resetPasswordForm.value.code]
                  ])
                ]),
                createBaseVNode("div", _hoisted_53, [
                  _cache[46] || (_cache[46] = createBaseVNode("label", null, "新密码", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => resetPasswordForm.value.password = $event),
                    type: "password",
                    required: "",
                    placeholder: "请输入新密码（至少6位）",
                    class: "form-input",
                    minlength: "6"
                  }, null, 512), [
                    [vModelText, resetPasswordForm.value.password]
                  ])
                ]),
                createBaseVNode("div", _hoisted_54, [
                  _cache[47] || (_cache[47] = createBaseVNode("label", null, "确认新密码", -1)),
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => resetPasswordForm.value.confirmPassword = $event),
                    type: "password",
                    required: "",
                    placeholder: "请再次输入新密码",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, resetPasswordForm.value.confirmPassword]
                  ])
                ]),
                createBaseVNode("button", {
                  type: "submit",
                  disabled: loading2.value,
                  class: "auth-submit-btn"
                }, toDisplayString(loading2.value ? "重置中..." : "重置密码"), 9, _hoisted_55)
              ], 32)) : createCommentVNode("", true)
            ])),
            createVNode(ToastContainer, {
              "error-message": toastError.value,
              "success-message": toastSuccess.value,
              duration: 3e3,
              "auto-close": true,
              onClearError: _cache[18] || (_cache[18] = ($event) => toastError.value = ""),
              onClearSuccess: _cache[19] || (_cache[19] = ($event) => toastSuccess.value = "")
            }, null, 8, ["error-message", "success-message"])
          ]);
        };
      }
    };
    const AuthComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-798c14d2"]]);
    const AuthComponent$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: AuthComponent
    }, Symbol.toStringTag, { value: "Module" }));
    const _hoisted_1$1 = {
      key: 0,
      class: "debug-panel"
    };
    const _hoisted_2$1 = { class: "debug-content" };
    const _hoisted_3$1 = { class: "debug-section" };
    const _hoisted_4$1 = { class: "status-item" };
    const _hoisted_5$1 = { class: "status-item" };
    const _hoisted_6$1 = { class: "value" };
    const _hoisted_7$1 = { class: "status-item" };
    const _hoisted_8$1 = { class: "value token" };
    const _hoisted_9$1 = { class: "status-item" };
    const _hoisted_10$1 = { class: "value token" };
    const _hoisted_11$1 = { class: "status-item" };
    const _hoisted_12$1 = { class: "debug-section" };
    const _hoisted_13$1 = {
      key: 0,
      class: "test-result"
    };
    const _hoisted_14$1 = { class: "debug-section" };
    const _hoisted_15$1 = { class: "headers-preview" };
    const _sfc_main$1 = {
      __name: "DebugPanel",
      setup(__props) {
        const showDebug = ref(false);
        const localStorageToken = ref("");
        const apiTestResult = ref("");
        const isAuthenticated2 = computed(() => userStore$1.isAuthenticated.value);
        const memoryToken = computed(() => userStore$1.token.value);
        const userInfo = computed(() => {
          if (userStore$1.user.value) {
            return `${userStore$1.user.value.email} (ID: ${userStore$1.user.value.id})`;
          }
          return "无用户信息";
        });
        const tokensMatch = computed(() => {
          const memory = memoryToken.value;
          const localStorage2 = localStorageToken.value;
          return memory && localStorage2 && memory === localStorage2;
        });
        const requestHeaders = computed(() => {
          const token2 = localStorageToken.value;
          if (token2) {
            return JSON.stringify({
              "Authorization": `Bearer ${token2.substring(0, 20)}...`,
              "Content-Type": "application/json"
            }, null, 2);
          }
          return JSON.stringify({
            "Content-Type": "application/json"
          }, null, 2);
        });
        const toggleDebug = () => {
          showDebug.value = !showDebug.value;
          if (showDebug.value) {
            refreshTokens();
          }
        };
        const refreshTokens = () => {
          localStorageToken.value = localStorage.getItem("auth_token") || "";
          console.log("Token状态刷新:", {
            memory: memoryToken.value,
            localStorage: localStorageToken.value,
            match: tokensMatch.value
          });
        };
        const testAPI = async () => {
          try {
            apiTestResult.value = "测试中...";
            const result = await linkAPI.getLinks();
            apiTestResult.value = JSON.stringify({
              success: true,
              dataLength: (result == null ? void 0 : result.length) || 0,
              message: "请求成功"
            }, null, 2);
          } catch (error2) {
            apiTestResult.value = JSON.stringify({
              success: false,
              error: error2.message,
              status: error2.status || "unknown"
            }, null, 2);
          }
        };
        const clearTokens = () => {
          localStorage.removeItem("auth_token");
          userStore$1.token.value = null;
          userStore$1.user.value = null;
          refreshTokens();
          apiTestResult.value = "";
          console.log("所有Token已清除");
        };
        onMounted(() => {
          refreshTokens();
          window.addEventListener("storage", (e) => {
            if (e.key === "auth_token") {
              refreshTokens();
            }
          });
        });
        return (_ctx, _cache) => {
          return showDebug.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
            createBaseVNode("div", { class: "debug-header" }, [
              _cache[0] || (_cache[0] = createBaseVNode("h3", null, "🔧 调试面板", -1)),
              createBaseVNode("button", {
                onClick: toggleDebug,
                class: "close-btn"
              }, "×")
            ]),
            createBaseVNode("div", _hoisted_2$1, [
              createBaseVNode("div", _hoisted_3$1, [
                _cache[6] || (_cache[6] = createBaseVNode("h4", null, "认证状态", -1)),
                createBaseVNode("div", _hoisted_4$1, [
                  _cache[1] || (_cache[1] = createBaseVNode("span", { class: "label" }, "登录状态:", -1)),
                  createBaseVNode("span", {
                    class: normalizeClass(["status", isAuthenticated2.value ? "success" : "error"])
                  }, toDisplayString(isAuthenticated2.value ? "已登录" : "未登录"), 3)
                ]),
                createBaseVNode("div", _hoisted_5$1, [
                  _cache[2] || (_cache[2] = createBaseVNode("span", { class: "label" }, "用户信息:", -1)),
                  createBaseVNode("span", _hoisted_6$1, toDisplayString(userInfo.value), 1)
                ]),
                createBaseVNode("div", _hoisted_7$1, [
                  _cache[3] || (_cache[3] = createBaseVNode("span", { class: "label" }, "Token (内存):", -1)),
                  createBaseVNode("span", _hoisted_8$1, toDisplayString(memoryToken.value || "无"), 1)
                ]),
                createBaseVNode("div", _hoisted_9$1, [
                  _cache[4] || (_cache[4] = createBaseVNode("span", { class: "label" }, "Token (localStorage):", -1)),
                  createBaseVNode("span", _hoisted_10$1, toDisplayString(localStorageToken.value || "无"), 1)
                ]),
                createBaseVNode("div", _hoisted_11$1, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "label" }, "Token匹配:", -1)),
                  createBaseVNode("span", {
                    class: normalizeClass(["status", tokensMatch.value ? "success" : "error"])
                  }, toDisplayString(tokensMatch.value ? "匹配" : "不匹配"), 3)
                ])
              ]),
              createBaseVNode("div", _hoisted_12$1, [
                _cache[8] || (_cache[8] = createBaseVNode("h4", null, "测试操作", -1)),
                createBaseVNode("div", { class: "button-group" }, [
                  createBaseVNode("button", {
                    onClick: refreshTokens,
                    class: "debug-btn"
                  }, "刷新Token状态"),
                  createBaseVNode("button", {
                    onClick: testAPI,
                    class: "debug-btn"
                  }, "测试API请求"),
                  createBaseVNode("button", {
                    onClick: clearTokens,
                    class: "debug-btn danger"
                  }, "清除所有Token")
                ]),
                apiTestResult.value ? (openBlock(), createElementBlock("div", _hoisted_13$1, [
                  _cache[7] || (_cache[7] = createBaseVNode("h5", null, "API测试结果:", -1)),
                  createBaseVNode("pre", null, toDisplayString(apiTestResult.value), 1)
                ])) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_14$1, [
                _cache[9] || (_cache[9] = createBaseVNode("h4", null, "请求头预览", -1)),
                createBaseVNode("div", _hoisted_15$1, [
                  createBaseVNode("code", null, toDisplayString(requestHeaders.value), 1)
                ])
              ])
            ])
          ])) : createCommentVNode("", true);
        };
      }
    };
    const DebugPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-dba5723e"]]);
    const DebugPanel$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: DebugPanel
    }, Symbol.toStringTag, { value: "Module" }));
    const _sfc_main = {
      name: "UpdateNotification",
      props: {
        updateInfo: {
          type: Object,
          required: true
        },
        visible: {
          type: Boolean,
          default: false
        }
      },
      emits: ["close", "update", "later"],
      setup(props, { emit: emit2 }) {
        const skipForWeek = ref(false);
        const isUpdating = ref(false);
        const handleClose = () => {
          emit2("close");
        };
        const handleOverlayClick = () => {
          handleClose();
        };
        const handleSkipChange = () => {
        };
        const handleLater = () => {
          if (skipForWeek.value) {
            versionService.setSkipVersionCheck(props.updateInfo.latestVersion, 7);
          }
          emit2("later");
          handleClose();
        };
        const handleUpdate = async () => {
          try {
            isUpdating.value = true;
            if (skipForWeek.value) {
              versionService.setSkipVersionCheck(props.updateInfo.latestVersion, 7);
            }
            emit2("update", props.updateInfo);
            setTimeout(() => {
              window.open(props.updateInfo.scriptInfo.downloadUrl, "_blank");
              handleClose();
            }, 500);
          } catch (error2) {
            console.error("处理更新失败:", error2);
          } finally {
            setTimeout(() => {
              isUpdating.value = false;
            }, 1e3);
          }
        };
        const formatUpdateLog = (description) => {
          if (!description) return "";
          if (description.includes("\n")) {
            return description.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).map((line) => {
              if (line.match(/^\d+\.\s/)) {
                return line;
              }
              if (line.startsWith("*")) {
                return line.replace(/^\*\s*/, "• ");
              }
              if (line.startsWith("-")) {
                return line.replace(/^-\s*/, "• ");
              }
              return "• " + line;
            }).join("<br>").replace(/(\d+\.\d+\.\d+)/g, "<strong>$1</strong>");
          }
          if (description.match(/^\d+\.\d+\.\d+/)) {
            return description.replace(/\n/g, "<br>").replace(/\*\s*(.+)/g, "• $1").replace(/(\d+\.\d+\.\d+)/g, "<strong>$1</strong>");
          }
          const logKeywords = ["更新日志", "新日志", "更新说明", "版本更新", "changelog", "update log"];
          let content = description;
          for (const keyword of logKeywords) {
            const index = content.toLowerCase().indexOf(keyword.toLowerCase());
            if (index !== -1) {
              const afterKeyword = content.substring(index + keyword.length);
              content = afterKeyword.replace(/^[:\s\-=]+/, "").trim();
              break;
            }
          }
          const lines = content.split("\n").filter((line) => line.trim());
          if (lines.length > 5) {
            content = lines.slice(0, 5).join("\n") + "\n...";
          }
          return content.replace(/\n/g, "<br>").replace(/\*\s*(.+)/g, "• $1").replace(/(\d+\.\d+\.\d+)/g, "<strong>$1</strong>");
        };
        return {
          skipForWeek,
          isUpdating,
          handleClose,
          handleOverlayClick,
          handleSkipChange,
          handleLater,
          handleUpdate,
          formatUpdateLog
        };
      }
    };
    const _hoisted_1 = { class: "notification-header" };
    const _hoisted_2 = { class: "version-info" };
    const _hoisted_3 = { class: "version-row" };
    const _hoisted_4 = { class: "version-current" };
    const _hoisted_5 = { class: "version-row" };
    const _hoisted_6 = { class: "version-latest" };
    const _hoisted_7 = {
      key: 0,
      class: "update-description"
    };
    const _hoisted_8 = ["innerHTML"];
    const _hoisted_9 = { class: "notification-actions" };
    const _hoisted_10 = { class: "skip-option" };
    const _hoisted_11 = { class: "skip-checkbox" };
    const _hoisted_12 = { class: "action-buttons" };
    const _hoisted_13 = ["disabled"];
    const _hoisted_14 = ["disabled"];
    const _hoisted_15 = {
      key: 0,
      class: "loading-spinner"
    };
    function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
      var _a, _b, _c, _d;
      return $props.visible ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "update-notification-overlay",
        onClick: _cache[6] || (_cache[6] = (...args) => $setup.handleOverlayClick && $setup.handleOverlayClick(...args))
      }, [
        createBaseVNode("div", {
          class: "update-notification",
          onClick: _cache[5] || (_cache[5] = withModifiers(() => {
          }, ["stop"]))
        }, [
          createBaseVNode("div", _hoisted_1, [
            _cache[8] || (_cache[8] = createStaticVNode('<div class="header-icon" data-v-8ddffaa9><svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-8ddffaa9><path d="M303.3088 772.9152l-68.608-3.8912c-44.6464-1.4336-89.2928-37.4784-114.8928-65.1264-26.624-28.4672-37.2736-68.4032-36.864-107.9296-0.2048-39.936 12.4928-88.6784 39.5264-117.76 23.3472-25.3952 61.0304-49.152 101.7856-59.8016h0.4096l43.4176-6.7584c1.2288-0.2048 2.2528-1.024 2.6624-2.4576l12.4928-49.3568c11.0592-52.224 35.2256-111.4112 73.9328-147.2512 55.5008-50.5856 137.4208-67.1744 210.3296-51.2 72.704 15.9744 140.4928 76.5952 175.3088 135.5776l19.2512 33.1776c0.4096 0.8192 1.2288 1.2288 2.048 1.4336l36.2496 8.3968h0.2048c48.9472 15.9744 82.3296 41.5744 111.8208 73.728 11.4688 12.288 23.7568 32.768 31.5392 47.7184 5.9392 12.0832 21.0944 30.72 40.1408 24.1664 17.2032-6.144 20.0704-27.648 7.5776-53.0432-11.4688-23.9616-26.2144-45.8752-44.2368-65.3312-41.7792-46.08-84.5824-75.1616-145.2032-81.92-1.024-0.2048-2.048-0.8192-2.4576-1.8432-40.5504-91.3408-120.832-157.9008-216.6784-178.9952-96.4608-21.2992-197.2224 5.9392-270.7456 72.9088-50.7904 47.5136-71.0656 109.568-85.8112 177.9712-0.2048 1.2288-1.4336 2.2528-2.6624 2.4576-51.6096 5.9392-99.5328 30.5152-135.168 69.0176C2.2528 519.5776 1.8432 664.3712 87.2448 757.76c39.1168 43.008 93.3888 69.632 150.9376 72.704 14.7456 0.8192 63.0784 2.4576 65.536 2.6624h0.2048c10.4448-0.2048 20.2752-4.5056 27.4432-12.0832s6.9632-28.4672-0.4096-36.0448c-7.3728-7.7824-17.2032-12.0832-27.648-12.0832z m669.696-236.7488c-13.1072-0.4096-25.1904 7.3728-30.5152 19.456-5.3248 12.288-2.8672 26.4192 6.3488 36.0448 9.216 9.6256 22.9376 12.4928 35.2256 7.5776 12.0832-4.9152 20.0704-16.9984 20.0704-30.3104 0.4096-17.8176-13.5168-32.3584-31.1296-32.768z m-15.36 114.4832c-12.6976 0.2048-18.8416 8.3968-26.2144 19.456-6.3488 9.4208-11.264 16.9984-17.408 26.624-24.1664 37.4784-84.5824 79.4624-145.6128 78.4384h-38.0928c-22.3232 0.4096-39.7312 7.168-37.4784 29.9008 2.048 21.2992 24.3712 23.552 34.4064 23.552h35.4304c87.8592-0.2048 167.5264-46.2848 214.2208-122.0608 7.7824-11.264 11.8784-24.7808 8.3968-38.0928-2.2528-9.0112-14.9504-18.0224-27.648-17.8176z m-259.6864-101.9904l-153.3952-156.4672c-5.9392-6.3488-14.1312-10.0352-22.9376-10.0352-8.6016 0-16.9984 3.6864-22.9376 10.0352l-155.8528 157.696c-12.6976 13.312-15.5648 32.768-2.4576 45.6704 8.192 8.192 29.696 8.6016 43.008-2.8672l0.2048-0.2048 105.2672-110.592c2.048-2.048 5.5296-0.6144 5.5296 2.2528v413.0816c-0.4096 12.0832 5.5296 23.552 15.7696 29.696 5.9392 3.4816 16.384 3.8912 22.528 0 10.0352-6.3488 16.1792-17.6128 15.7696-29.696V484.1472c0-2.8672 3.4816-4.3008 5.3248-2.2528l106.7008 110.7968c5.9392 6.144 28.672 15.5648 42.1888 1.6384 13.312-13.1072 8.192-32.3584-4.7104-45.6704z m0 0" fill="#4CAF50" data-v-8ddffaa9></path></svg></div><div class="header-content" data-v-8ddffaa9><h3 class="notification-title" data-v-8ddffaa9>发现新版本</h3><p class="notification-subtitle" data-v-8ddffaa9>DoubanFlix 有新版本可用</p></div>', 2)),
            createBaseVNode("button", {
              class: "close-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleClose && $setup.handleClose(...args)),
              title: "关闭"
            }, _cache[7] || (_cache[7] = [
              createBaseVNode("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 16 16",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                createBaseVNode("path", {
                  d: "M12 4L4 12M4 4L12 12",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)
            ]))
          ]),
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("div", _hoisted_3, [
              _cache[9] || (_cache[9] = createBaseVNode("span", { class: "version-label" }, "当前版本:", -1)),
              createBaseVNode("span", _hoisted_4, toDisplayString($props.updateInfo.currentVersion), 1)
            ]),
            createBaseVNode("div", _hoisted_5, [
              _cache[10] || (_cache[10] = createBaseVNode("span", { class: "version-label" }, "最新版本:", -1)),
              createBaseVNode("span", _hoisted_6, toDisplayString($props.updateInfo.latestVersion), 1)
            ])
          ]),
          ((_a = $props.updateInfo.scriptInfo) == null ? void 0 : _a.updateNote) || ((_b = $props.updateInfo.scriptInfo) == null ? void 0 : _b.description) ? (openBlock(), createElementBlock("div", _hoisted_7, [
            _cache[11] || (_cache[11] = createBaseVNode("h4", { class: "description-title" }, "更新日志", -1)),
            createBaseVNode("div", {
              class: "description-content",
              innerHTML: $setup.formatUpdateLog(((_c = $props.updateInfo.scriptInfo) == null ? void 0 : _c.updateNote) || ((_d = $props.updateInfo.scriptInfo) == null ? void 0 : _d.description))
            }, null, 8, _hoisted_8)
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_9, [
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("label", _hoisted_11, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.skipForWeek = $event),
                  onChange: _cache[2] || (_cache[2] = (...args) => $setup.handleSkipChange && $setup.handleSkipChange(...args))
                }, null, 544), [
                  [vModelCheckbox, $setup.skipForWeek]
                ]),
                _cache[12] || (_cache[12] = createBaseVNode("span", { class: "checkmark" }, null, -1)),
                _cache[13] || (_cache[13] = createBaseVNode("span", { class: "skip-text" }, "一周内不再提醒", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_12, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[3] || (_cache[3] = (...args) => $setup.handleLater && $setup.handleLater(...args)),
                disabled: $setup.isUpdating
              }, " 稍后提醒 ", 8, _hoisted_13),
              createBaseVNode("button", {
                class: "btn btn-primary",
                onClick: _cache[4] || (_cache[4] = (...args) => $setup.handleUpdate && $setup.handleUpdate(...args)),
                disabled: $setup.isUpdating
              }, [
                $setup.isUpdating ? (openBlock(), createElementBlock("span", _hoisted_15)) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString($setup.isUpdating ? "正在跳转..." : "立即更新"), 1)
              ], 8, _hoisted_14)
            ])
          ])
        ])
      ])) : createCommentVNode("", true);
    }
    const UpdateNotification = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8ddffaa9"]]);
    const UpdateNotification$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: UpdateNotification
    }, Symbol.toStringTag, { value: "Module" }));
  })();
})();

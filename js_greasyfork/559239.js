// ==UserScript==
// @name         抖音网页版自动最高画质
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动将抖音网页版视频切换为最高画质
// @author       GQLJ
// @license      MIT
// @match        https://*.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559239/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559239/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

  (function() {
      'use strict';

      // ==================== 配置 ====================
      const CONFIG = {
          DEBUG: false,  // 设为 true 开启调试日志
          RETRY_DELAY: 800,
          CLICK_DELAY: 200
      };

      // 画质优先级（数字越小优先级越高）
      const QUALITY_PRIORITY = [
          { keywords: ['4K', '超清4K'], priority: 1 },
          { keywords: ['2K', '超清2K'], priority: 2 },
          { keywords: ['1080', '1080P', '高清1080'], priority: 3 },
          { keywords: ['720', '720P', '高清720'], priority: 4 },
          { keywords: ['540', '540P', '标清540'], priority: 5 }
      ];

      // ==================== 工具函数 ====================
      function log(...args) {
          if (CONFIG.DEBUG) console.log('[画质脚本]', ...args);
      }

      // ==================== 核心功能 ====================
      let isProcessing = false;
      let currentUrl = location.href;
      let lastVideoSrc = '';
      let retryTimer = null;

      // 查找并点击画质按钮
      function clickQualityButton() {
          const selectors = [
              'xg-icon.xgplayer-definition',
              '[class*="xgplayer-definition"]',
              '[class*="qualityIcon"]',
              '[class*="quality-icon"]',
              '[class*="definition"]'
          ];

          // 方法1: 通过选择器查找
          for (const selector of selectors) {
              try {
                  const btn = document.querySelector(selector);
                  if (btn && btn.offsetParent !== null) {
                      log('通过选择器找到按钮:', selector);
                      btn.click();
                      return true;
                  }
              } catch (e) {}
          }

          // 方法2: 在控制栏中查找包含画质文字的元素
          const controlBar = document.querySelector('[class*="xgplayer-controls"]') ||
                            document.querySelector('[class*="control-bar"]') ||
                            document.querySelector('[class*="player-controls"]');

          if (controlBar) {
              const buttons = controlBar.querySelectorAll('div, span, button');
              for (const btn of buttons) {
                  const text = btn.textContent.trim();
                  if ((text === '智能' || /^(4K|2K|1080|720|540)P?$/.test(text) ||
                       text.includes('清')) && text.length < 10) {
                      log('通过文本找到按钮:', text);
                      btn.click();
                      return true;
                  }
              }
          }

          log('未找到画质按钮');
          return false;
      }

      // 选择最高画质
      function selectBestQuality() {
          setTimeout(() => {
              // 优先在弹出菜单中查找
              const popup = document.querySelector(
                  '[class*="definition-list"], [class*="quality-list"], ' +
                  '[class*="xgplayer-definition-list"], [class*="setting-panel"]'
              );
              const searchRoot = popup || document;

              const allElements = Array.from(searchRoot.querySelectorAll('div, li, span'));
              const candidates = [];

              for (const el of allElements) {
                  const text = el.textContent.trim();
                  const rect = el.getBoundingClientRect();

                  // 跳过不可见元素
                  if (rect.width === 0 || rect.height === 0) continue;

                  // 匹配画质关键词
                  for (const config of QUALITY_PRIORITY) {
                      for (const keyword of config.keywords) {
                          if (text.includes(keyword) && text.length < 20) {
                              // 优先选择叶子节点或只有一个子元素的节点
                              if (el.children.length <= 1) {
                                  candidates.push({
                                      element: el,
                                      text: text,
                                      priority: config.priority,
                                      keyword: keyword
                                  });
                              }
                              break;
                          }
                      }
                  }
              }

              if (candidates.length === 0) {
                  log('未找到画质选项');
                  return;
              }

              // 按优先级排序
              candidates.sort((a, b) => a.priority - b.priority);
              log('找到画质选项:', candidates.map(c => c.text).join(', '));

              const best = candidates[0];

              // 检查是否已选中
              const classes = (best.element.className || '') + ' ' +
                             (best.element.parentElement?.className || '');
              if (/active|selected|current/i.test(classes)) {
                  log('已是最高画质:', best.text);
                  return;
              }

              // 点击切换
              best.element.click();
              log('已切换到:', best.text);

              // 关闭可能的遮罩层
              setTimeout(() => {
                  const masks = document.querySelectorAll('[class*="mask"], [class*="overlay"]');
                  masks.forEach(m => {
                      if (m.offsetParent !== null) {
                          try { m.click(); } catch (e) {}
                      }
                  });
              }, 100);

          }, CONFIG.CLICK_DELAY);
      }

      // 主执行函数
      function executeSwitch() {
          if (isProcessing) return;

          isProcessing = true;
          log('开始切换画质');

          if (clickQualityButton()) {
              selectBestQuality();
          }

          setTimeout(() => {
              isProcessing = false;
          }, CONFIG.RETRY_DELAY);
      }

      // 检测视频变化
      function checkVideo() {
          const video = document.querySelector('video');
          if (video && video.src && video.src !== lastVideoSrc) {
              lastVideoSrc = video.src;
              log('检测到新视频');

              if (retryTimer) clearTimeout(retryTimer);
              retryTimer = setTimeout(executeSwitch, CONFIG.RETRY_DELAY);
          }
      }

      // ==================== 初始化 ====================
      function init() {
          if (!document.body) {
              setTimeout(init, 100);
              return;
          }

          // 监听页面变化
          const observer = new MutationObserver(() => {
              if (location.href !== currentUrl) {
                  currentUrl = location.href;
                  lastVideoSrc = '';
                  log('URL 变化');
                  setTimeout(checkVideo, 1000);
              } else {
                  checkVideo();
              }
          });

          observer.observe(document.body, {
              childList: true,
              subtree: true
          });

          // 初始执行
          setTimeout(() => {
              checkVideo();
              executeSwitch();
          }, 1500);

          log('v1.0 已启动');
      }

      init();
  })();

// ==UserScript==
// @name         iyf player
// @namespace    http://tampermonkey.net/
// @version      2025-12-22
// @description  爱壹帆增强版：自动跳过片头片尾、去广告、沉浸式播放
// @author       xiaomingbeta
// @match        https://www.iyf.tv/*
// @match        https://iyf.tv/*
// @match        https://www.yfsp.tv/*
// @match        https://yfsp.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyf.tv
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559027/iyf%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/559027/iyf%20player.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
        /* 按钮组容器 */
        #tm-btn-group {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: none;
            gap: 10px;
        }

        /* 悬浮按钮样式 */
        #tm-float-btn, #tm-pip-btn {
            padding: 8px 18px;
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(105, 105, 105, 0.3);
            font-size: 14px;
            opacity: 0.8;
            transition: all 0.3s;
        }
        #tm-float-btn:hover, #tm-pip-btn:hover {
            background-color: #0056b3;
            opacity: 1;
        }

        /* 模态框背景遮罩 */
        #tm-modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            justify-content: center; align-items: center;
        }

        /* 模态框内容容器 */
        #tm-modal-content {
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            width: 300px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            text-align: center;
        }

        .tm-input {
            width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box;
            border: 1px solid #ccc; border-radius: 4px;
        }

        .tm-btn-group { display: flex; justify-content: space-between; margin-top: 15px; }
        .tm-action-btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        #tm-btn-confirm { background-color: #28a745; color: white; }
        #tm-btn-cancel { background-color: #dc3545; color: white; }
    `;
  GM_addStyle(css);

  // --- 2. 创建 DOM ---
  const modalHTML = `
        <div id="tm-modal-overlay">
            <div id="tm-modal-content">
                <h3 style="margin-top:0;">当前页面配置</h3>
                <div style="font-size:12px; color:#666; margin-bottom:10px; word-break:break-all;">
                    Key: <span id="tm-current-path"></span>
                </div>
                <input type="number" id="tm-input-1" class="tm-input" placeholder="跳过片头：单位秒 (如 90)">
                <input type="number" id="tm-input-2" class="tm-input" placeholder="跳过片尾：单位秒 (如 30)">
                <div class="tm-btn-group">
                    <button id="tm-btn-cancel" class="tm-action-btn">取消</button>
                    <button id="tm-btn-confirm" class="tm-action-btn">保存 & 确认</button>
                </div>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 创建按钮组容器
  const btnGroup = document.createElement('div');
  btnGroup.id = 'tm-btn-group';

  const floatBtn = document.createElement('button');
  floatBtn.id = 'tm-float-btn';
  floatBtn.innerText = '⚙️ 片头片尾';

  // 画中画按钮
  const pipBtn = document.createElement('button');
  pipBtn.id = 'tm-pip-btn';
  pipBtn.innerText = '📺 画中画';
  pipBtn.addEventListener('click', () => {
    const video = document.querySelector('video#video_player');
    if (!video) {
      alert('未找到视频元素');
      return;
    }
    try {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('画中画错误:', error);
      alert('画中画功能启动失败: ' + error.message);
    }
  });

  btnGroup.appendChild(floatBtn);
  btnGroup.appendChild(pipBtn);
  document.body.appendChild(btnGroup);

  const modalOverlay = document.getElementById('tm-modal-overlay');
  const input1 = document.getElementById('tm-input-1');
  const input2 = document.getElementById('tm-input-2');
  const pathDisplay = document.getElementById('tm-current-path');
  const btnConfirm = document.getElementById('tm-btn-confirm');
  const btnCancel = document.getElementById('tm-btn-cancel');

  floatBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    input1.focus();
  });

  const closeModal = () => modalOverlay.style.display = 'none';
  btnCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  btnConfirm.addEventListener('click', () => {
    saveData();
    closeModal();
  });

  // --- 5. 数据存储逻辑 ---
  function getStorageKey() {
    // 使用 decodeURIComponent 处理 URL 中的中文字符
    return 'path_' + decodeURIComponent(window.location.pathname);
  };

  function loadData() {
    const key = getStorageKey();
    pathDisplay.innerText = window.location.pathname;
    const savedData = GM_getValue(key, {});
    // 确保读取出的值可以被显示
    input1.value = savedData.val1 || '';
    input2.value = savedData.val2 || '';
    console.log(`[Tampermonkey] 读取成功 (Key: ${key})`, savedData);
  };

  function saveData() {
    const key = getStorageKey();
    const data = {
      val1: input1.value,
      val2: input2.value,
      updatedAt: new Date().getTime()
    };
    GM_setValue(key, data);
    console.log(`[Tampermonkey] 保存成功 (Key: ${key})`, data);
    // 如果想在保存后立即应用新设置，可以在这里加逻辑，或者刷新页面
  };

  // --- 6. 页面清理逻辑 ---
  function removeElementsExcept(selector) {
    console.log('removeElementsExcept', selector);
    const root = document.querySelector('div.video-module');
    const el = document.querySelector(selector);
    if (!el) return false;

    // 避免重复执行
    if (el.getAttribute('removeElementsExcept') === 'true') return true;

    let current = el;
    const keepChain = [];
    while (current) {
      keepChain.unshift(current);
      if (current === document.body || current === root) break;
      current = current.parentNode;
    }

    for (let i = 0; i < keepChain.length - 1; i++) {
      const node = keepChain[i];
      const child = keepChain[i + 1];
      Array.from(node.childNodes).forEach(n => {
        if (n !== child) n.remove();
      });
      // 强制全屏样式
      // node.style.cssText = `width:100vw!important;height:100vh!important;margin:0!important;padding:0!important;overflow:hidden!important;`;
      node.style.cssText = `width:${window.innerWidth - 10}px!important;height:${window.innerHeight - 10}px!important;margin:0px!important;padding:0px!important;`;
    }
    el.setAttribute('removeElementsExcept', 'true');
    return true;
  }

  function hide(selector) {
    const el = document.querySelector(selector);
    if (el) el.style.display = 'none';
  }

  // --- 7. 等待元素工具 ---
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          clearTimeout(timer);
          resolve(element);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      const timer = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout: Element ${selector} not found`));
      }, timeout);
    });
  }

  function waitAndRun(selector, callback) {
    waitForElement(selector)
      .then((element) => {
        console.log('waitAndRun', selector, '加载完毕！');
        callback(element);
      })
      .catch((err) => console.log('WaitAndRun Safe Fail:', err.message));
  }

  var lastUrl = '';
  var lastDuration = 0;
  var lastVideoSrc = ''; // 保存当前视频的src,用于检测视频源变化
  var nextClicked = false;
  var isAd = false;
  var currentVideo = null; // 保存当前视频元素引用
  var currentPageId = 0; // 页面变化的序列号,用于识别过期的回调

  // 检查页面ID是否有效
  const isPageValid = (pageId) => pageId === currentPageId;

  // 定义事件处理器函数
  const handleCanPlay = () => {
    console.log('[handleCanPlay] 被调用', `currentVideo存在:${!!currentVideo}, isAd:${isAd}`);
    if (!currentVideo) return;
    const skipStart = Number(input1.value);
    if (!isAd && skipStart > 0 && currentVideo.currentTime < skipStart) {
      console.log(`跳过片头 ${skipStart}s`);
      currentVideo.currentTime = skipStart;
    }
  };

  const handleError = () => {
    console.log('[handleError] 被调用', `currentVideo存在:${!!currentVideo}`);
    if (!currentVideo) return;
    console.error('Video error:', currentVideo.error);
  };

  const handleTimeUpdate = () => {
    if (!currentVideo || Number.isNaN(currentVideo.duration)) return;

    // 检查视频源是否变化
    const currentSrc = currentVideo.src || currentVideo.currentSrc;
    if (lastVideoSrc !== currentSrc) {
      console.log('[handleTimeUpdate] 视频源变化', `${lastVideoSrc} -> ${currentSrc}`);
      lastVideoSrc = currentSrc;
      lastDuration = 0;
      nextClicked = false;
      isAd = false;
    }

    // 首次加载或重置后初始化
    if (lastDuration === 0) {
      console.log('[handleTimeUpdate] 初始化 lastDuration', `duration: ${currentVideo.duration}, src: ${currentSrc}`);
      lastDuration = currentVideo.duration;
    }

    // 简单广告检测：总时长小于30秒的判定为广告
    const newIsAd = currentVideo.duration < 30;
    if (newIsAd !== isAd) {
      isAd = newIsAd;
      if (isAd) {
        console.log('[handleTimeUpdate] 检测到广告(时长<30秒)，暂停', `duration: ${currentVideo.duration}`);
        currentVideo.pause();
      } else {
        console.log('[handleTimeUpdate] 广告结束，恢复正片', `duration: ${currentVideo.duration}`);
      }
    }

    // 跳过片尾并播放下一集
    const skipEnd = Number(input2.value);
    if (skipEnd > 0 && (currentVideo.duration - currentVideo.currentTime) < skipEnd && !isAd && !nextClicked) {
      console.log('下一集', skipEnd, `${currentVideo.currentTime}/${currentVideo.duration}`);
      nextClicked = true;

      // 立即暂停视频,防止继续触发 timeupdate
      currentVideo.pause();

      const next = document.querySelector('div.play-next.control-item');
      if (next) {
        next.click();
      } else {
        // 如果没找到按钮，直接跳到结束，触发播放器的自动完成逻辑
        currentVideo.currentTime = currentVideo.duration;
      }
    }
  };

  function onUrlChange() {
    // 避免重复调用
    if (window.location.href === lastUrl) return;
    lastUrl = window.location.href;

    console.log('[onUrlChange] URL变化', window.location.href);

    // 移除旧视频的事件监听器
    if (currentVideo) {
      console.log('[onUrlChange] 移除旧视频监听器', currentVideo);
      currentVideo.removeEventListener('canplay', handleCanPlay);
      currentVideo.removeEventListener('error', handleError);
      currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
      currentVideo = null;
    }

    // 重置状态变量
    lastDuration = 0;
    lastVideoSrc = '';
    nextClicked = false;
    isAd = false;

    console.log('[onUrlChange] 状态已重置', `lastDuration=${lastDuration}, lastVideoSrc=${lastVideoSrc}, nextClicked=${nextClicked}, isAd=${isAd}`);

    if (window.location.href.includes('/play/')) {
      console.log('Detected Play Page');

      loadData();
      btnGroup.style.display = 'flex';

      const selector = 'aa-videoplayer > div > div > vg-player';

      waitAndRun(selector, (_) => {
        // 尝试点击弹幕关闭
        const node = document.querySelector('.iconfont.icondanmukai');
        if (node) node.click();

        if (removeElementsExcept(selector)) {
          waitAndRun('video#video_player', (video) => {
            console.log('[waitAndRun video] 回调执行', `video:`, video, `currentVideo:`, currentVideo);

            // 如果已经为这个视频元素添加过监听器,则跳过
            if (currentVideo === video) {
              console.log('[waitAndRun video] 视频元素相同,跳过');
              return;
            }

            // 移除旧视频的监听器
            if (currentVideo) {
              console.log('[waitAndRun video] 移除旧视频监听器', currentVideo);
              currentVideo.removeEventListener('canplay', handleCanPlay);
              currentVideo.removeEventListener('error', handleError);
              currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
            }

            // 保存当前视频元素引用
            currentVideo = video;
            console.log('[waitAndRun video] 添加新监听器到视频', video);

            // 添加新的监听器
            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('error', handleError);
            video.addEventListener('timeupdate', handleTimeUpdate);
          });

          // 自动点击展开等按钮
          waitAndRun('div.control-left button', (btn0) => {
            btn0.click();
            waitAndRun('app-expandable-tabs button.expander', (btn1) => {
              btn1.click();
              waitAndRun('div.panel-container > div.panel > button:last-of-type', (btn2) => btn2.click());
            });
          });
        }

        // 隐藏杂项
        hide('div.navbar');
        hide('vg-pause-f');
        hide('app-sticky-block');
        hide('div.overlay-logo');
      });
    } else {
      // 非播放页
      const nav = document.querySelector('div.navbar');
      if (nav) nav.style.display = '';
      btnGroup.style.display = 'none';
    }
  }

  const _historyWrap = function (type) {
    const orig = history[type];
    return function () {
      const rv = orig.apply(this, arguments);
      const e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };

  history.pushState = _historyWrap('pushState');
  history.replaceState = _historyWrap('replaceState');

  window.addEventListener('pushState', onUrlChange);
  window.addEventListener('replaceState', onUrlChange);
  window.addEventListener('popstate', onUrlChange);

  setTimeout(onUrlChange, 500);
})();
// ==UserScript==
// @name         成都干部网络学院自动换课脚本
// @namespace    https://catatelier.site/
// @version      1.0
// @description  只适用于成都干部网络学院挂课的自动学习脚本，简单快捷一键式操作，如果因中途操作网页导致视频出现封面遮挡，需要用户自行点击封面开始播放视频。
// @match        *://cddx.org/*
// @match        *://www.cddx.org/*
// @grant        none
// @author       amacyan
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555726/%E6%88%90%E9%83%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555726/%E6%88%90%E9%83%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let running = false; 
  let videoMonitor = null; 
  let pageCheckTimer = null; 
  let navigationCheckTimer = null; 
  const STORAGE_KEY = 'autoStudyRunning'; 
  let video = null;
  let statusBox = null;
  let lastUrl = location.href; 
  let courseListUrl = ''; 

  function updateStatus(text) {
    if (!statusBox) return;
    const time = new Date().toLocaleTimeString();
    statusBox.innerText = `[${time}] ${text}`;
  }

  function createStatusBox() {
    statusBox = document.createElement('div');
    Object.assign(statusBox.style, {
      position: 'fixed',
      bottom: '70px',
      right: '20px',
      zIndex: 999998,
      background: 'rgba(0,0,0,0.75)',
      color: '#00FFAA',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'monospace',
      whiteSpace: 'pre-line',
      lineHeight: '1.4',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    });
    statusBox.innerText = '[脚本] 状态显示区已加载';
    document.body.appendChild(statusBox);
  }

  function loadRunningState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    running = saved === 'true';
    if (saved === 'returning') {
      running = true;
      isReturningFromVideo = true;
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    if (running) console.log('[脚本] 自动恢复运行状态');
  }

  function saveRunningState() {
    localStorage.setItem(STORAGE_KEY, running ? 'true' : 'false');
  }

  function createToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'autoStudyToggleBtn';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 999999,
      background: running ? '#f44336' : '#4CAF50',
      color: '#fff',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    });
    btn.innerText = running ? '⏸ 暂停自动学习' : '▶️ 启动自动学习';

    btn.addEventListener('click', () => {
      running = !running;
      saveRunningState();

      if (running) {
        btn.innerText = '⏸ 暂停自动学习';
        btn.style.background = '#f44336';
        console.log('[脚本] 自动学习已启动');
        updateStatus('运行中：检测页面类型…');
        startAutoProcess();
      } else {
        btn.innerText = '▶️ 启动自动学习';
        btn.style.background = '#4CAF50';
        console.log('[脚本] 自动学习已暂停');
        updateStatus('暂停中');
        resetAllStates();
      }
    });

    document.body.appendChild(btn);
  }


  function resetAllStates() {
    if (videoMonitor) {
      clearInterval(videoMonitor);
      videoMonitor = null;
      console.log('[脚本] 视频监控器已停止');
    }

    if (pageCheckTimer) {
      clearInterval(pageCheckTimer);
      pageCheckTimer = null;
      console.log('[脚本] 页面检测计时器已停止');
    }

    if (navigationCheckTimer) {
      clearInterval(navigationCheckTimer);
      navigationCheckTimer = null;
      console.log('[脚本] 导航检测计时器已停止');
    }

    console.log('[脚本] 所有状态已重置');
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScript);
  } else {
    initializeScript();
    console.log('[脚本] 页面开始执行初始化');
  }

  function initializeScript() {
    console.log('[脚本] 页面加载完成，初始化中…');

    resetAllStates();

    setTimeout(() => {
      loadRunningState();
      createStatusBox();

      if (!document.getElementById('autoStudyToggleBtn')) {
        createToggleButton();
      }

      updateStatus(running ? '运行中（自动恢复）' : '暂停中');
      if (running) {
        startAutoProcess();
        setupNavigationDetection();
      } else {
        setupNavigationDetection();
      }
    }, 1500);
  }

  function startAutoProcess() {
    if (!running) return;

    console.log('[脚本] 页面加载完成，立即检测页面类型…');
    updateStatus('页面加载完成，检测页面类型…');
    checkPageType();
  }

  function checkPageType() {
    if (!running) return;
    console.log('[脚本] 重新检测页面类型…');
    updateStatus('重新检测页面类型…');
    let tryCount = 0;
    const waitForProgress = setInterval(() => {
      tryCount++;
      if (document.querySelector('.list-box')) {
        console.log('[脚本] 班级详情页 → 检测课程');
        updateStatus('班级详情页 → 检测课程');
        clearInterval(waitForProgress);
        checkAndClickCourse();
      } else if (document.querySelector('.dhy-video-player')) {
        console.log('[脚本] 课程详情页 → 检测视频播放');
        updateStatus('课程详情页 → 检测视频播放');
        clearInterval(waitForProgress);
        monitorVideo();
      } else if (tryCount >= 30){
        clearInterval(waitForProgress);
        console.log('[脚本] 超时未检测到video元素');
        updateStatus('等待video元素超时');
        window.location.reload();
      }else {
        console.log('[脚本] 未识别页面类型，继续监控');
        updateStatus('未识别页面类型，持续监控中…');
      }
    },3000);
  }

  function checkAndClickCourse() {
    if (!running) return;

    const listBox = document.querySelector('.list-box');
    if (!listBox) {
      console.log('[脚本] 未检测到课程列表');
      updateStatus('检测课程中… 未发现课程列表');
      return;
    }

    const firstCourse = listBox.querySelector('.course-item');
    if (!firstCourse) {
      console.log('[脚本] list-box 下无课程项');
      updateStatus('检测课程中… 未发现课程项');
      return;
    }

    if(!firstCourse.querySelector('.ribbon-wrapper.not-pass')){
      console.log('[脚本] 未找到未通过课程');
      updateStatus('检测课程中… 未找到未通过课程');
      return;
    }

    const link = firstCourse.querySelector('.options a');
    if (link) {
      console.log('[脚本] 课程未完成，点击"学习"按钮');
      updateStatus('课程未完成 → 进入学习页面');
      courseListUrl = window.location.href; //记录跳转前页面地址
      link.click();
    } else {
      console.log('[脚本] 未找到 .options a');
      updateStatus('检测课程中… 未找到学习链接');
    }
  }

    function playVideo() {
      if (!running) return;
    }
  function monitorVideo() {
    if (!running) return;
    video = document.querySelector('.dhy-video-player');
    if (video) {
      const firstDiv = video.querySelector('div');
      if (firstDiv.classList.contains('vjs-paused')) {
        console.log('[脚本] 检测到视频已暂停');
        updateStatus('视频已暂停,请执行播放');
        watch();
      } else {
        console.log('[脚本] 检测到视频已播放');
        updateStatus('视频已播放=> 检测进度');
        watch();
      }
    }
  }

  function watch() {
    if (!running) return;
    const progressHolder = video.querySelector('.vjs-progress-holder.vjs-slider.vjs-slider-horizontal');
    //
    videoMonitor = setInterval(() => {
      if (!running) return;
      console.log('[脚本] 找到播放进度条，检测播放进度')
      const progress = parseFloat(progressHolder.getAttribute('aria-valuenow') || '0');
      updateStatus(`视频播放中 (${progress.toFixed(1)}%)`);

      if (progress >= 100) {
        console.log('[脚本] 视频播放完成，3 秒后返回上一页并刷新…');
        updateStatus('视频播放完成 → 3 秒后返回并刷新页面');
        if (videoMonitor) {
          videoMonitor = null;
        }
        setTimeout(() => {
          if (courseListUrl) {
            console.log('[脚本] 返回课程列表页:', courseListUrl);
            updateStatus('返回课程列表页...');
            window.location.href = courseListUrl;
          } else {
            console.log('[脚本] 未找到返回地址，使用history.back()');
            updateStatus('返回上一页...');
            history.back();
            location.reload();
          }
        },3000);
      }
    },1000);
  }
   function setupNavigationDetection() {
    lastUrl = location.href;
    if (!navigationCheckTimer) {
      navigationCheckTimer = setInterval(() => {
        if (location.href !== lastUrl) {
          console.log('[脚本] 检测到页面变化，URL: ', location.href);
          lastUrl = location.href;
          if (running) {
            console.log('[脚本] 页面变化后重置状态并重新检测页面类型');
            updateStatus('页面变化 → 重置状态并重新检测');
            resetAllStates();
            setTimeout(() => {
              if (running) {
                checkPageType();
              }
            }, 2000);
          }
        }
      }, 1000);
    }
  }

})();




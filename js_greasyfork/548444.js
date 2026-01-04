// ==UserScript==
// @name         云学堂视频学习监控（带控制面板）
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      3.0
// @description  云学堂学习监控脚本，带可拖拽控制面板，支持课程提取、学习监控、进度显示和日志记录
// @icon         https://picobd.yunxuetang.cn/sys/asiainfo/others/202305/efc8749aa9474334a99be88b3c1131e5.ico
// @author       You
// @match        https://asiainfo.yunxuetang.cn/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @ts-nocheck
// @downloadURL https://update.greasyfork.org/scripts/548444/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E7%9B%91%E6%8E%A7%EF%BC%88%E5%B8%A6%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548444/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E7%9B%91%E6%8E%A7%EF%BC%88%E5%B8%A6%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%EF%BC%89.meta.js
// ==/UserScript==

/*
 * 云学堂学习监控脚本使用说明：
 * 
 * 1. 进入个人任务中心：https://asiainfo.yunxuetang.cn/sty/index.htm
 * 2. 点击任意学习任务，进入任务详情页面
 * 3. 脚本会自动显示可拖拽的控制面板
 * 4. 在任务详情页面点击"提取课程"按钮提取所有课程链接
 * 5. 在学习页面点击"开始监控"按钮开始自动学习监控
 * 
 * 控制面板功能：
 * - 课程提取：自动提取任务中的所有课程链接
 * - 学习监控：监控学习进度和剩余时间
 * - 总体进度：显示当前课程在所有课程中的位置
 * - 课程列表：查看和跳转到指定课程
 * - 运行日志：实时显示脚本运行状态
 * - 可拖拽移动：面板可自由拖拽到任意位置
 */

(function () {
  'use strict';

  let notificationShown = false;
  let pageLoaded = false;
  let autoScrollInterval = null;

  // 控制面板相关变量
  let controlPanel = null;
  let isExtracting = false;
  let extractProgress = { current: 0, total: 0 };
  let learningMonitorInterval = null;

  // 添加样式
  // @ts-ignore
  GM_addStyle(`
    #yunxuetang-monitor-panel {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      width: 320px !important;
      background: #fff !important;
      border: 2px solid #007bff !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      z-index: 999999 !important;
      font-family: Arial, sans-serif !important;
      font-size: 12px !important;
      box-sizing: border-box !important;
    }
    #yunxuetang-monitor-panel * {
      box-sizing: border-box !important;
    }
    #yunxuetang-monitor-panel .panel-header {
      background: #007bff !important;
      color: white !important;
      padding: 12px !important;
      font-weight: bold !important;
      border-radius: 6px 6px 0 0 !important;
      cursor: move !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      min-height: 40px !important;
    }
    #yunxuetang-monitor-panel .panel-body {
      padding: 15px !important;
    }
    #yunxuetang-monitor-panel .section {
      margin-bottom: 15px !important;
      padding-bottom: 10px !important;
      border-bottom: 1px solid #eee !important;
    }
    #yunxuetang-monitor-panel .section:last-child {
      border-bottom: none !important;
      margin-bottom: 0 !important;
    }
    #yunxuetang-monitor-panel .section-title {
      font-weight: bold !important;
      margin-bottom: 8px !important;
      color: #333 !important;
      font-size: 13px !important;
    }
    #yunxuetang-monitor-panel button {
      width: 100% !important;
      padding: 8px 12px !important;
      margin: 3px 0 !important;
      border: none !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      font-size: 11px !important;
      font-weight: bold !important;
      min-height: 32px !important;
      line-height: 1.2 !important;
      text-align: center !important;
      display: inline-block !important;
      vertical-align: middle !important;
    }
    #yunxuetang-monitor-panel .btn-primary {
      background: #007bff !important;
      color: white !important;
    }
    #yunxuetang-monitor-panel .btn-success {
      background: #28a745 !important;
      color: white !important;
    }
    #yunxuetang-monitor-panel .btn-danger {
      background: #dc3545 !important;
      color: white !important;
    }
    #yunxuetang-monitor-panel .btn-secondary {
      background: #6c757d !important;
      color: white !important;
    }
    #yunxuetang-monitor-panel .btn:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
    }
    #yunxuetang-monitor-panel .progress {
      background: #f0f0f0 !important;
      border-radius: 4px !important;
      height: 20px !important;
      margin: 8px 0 !important;
      overflow: hidden !important;
      position: relative !important;
    }
    #yunxuetang-monitor-panel .progress-bar {
      background: #28a745 !important;
      height: 100% !important;
      transition: width 0.3s !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: white !important;
      font-size: 10px !important;
      font-weight: bold !important;
      min-height: 20px !important;
      line-height: 20px !important;
      margin-top: 0;
    }
    #yunxuetang-monitor-panel .status {
      font-size: 11px !important;
      color: #666 !important;
      margin: 5px 0 !important;
      padding: 4px 8px !important;
      background: #f8f9fa !important;
      border-radius: 3px !important;
    }
    #yunxuetang-monitor-panel .log {
      max-height: 120px !important;
      overflow-y: auto !important;
      background: #f8f9fa !important;
      border: 1px solid #dee2e6 !important;
      border-radius: 4px !important;
      padding: 8px !important;
      font-size: 10px !important;
      line-height: 1.3 !important;
    }
    #yunxuetang-monitor-panel .log-entry {
      margin: 2px 0 !important;
      word-wrap: break-word !important;
    }
    #yunxuetang-monitor-panel .log-info { color: #333 !important; }
    #yunxuetang-monitor-panel .log-success { color: #28a745 !important; }
    #yunxuetang-monitor-panel .log-error { color: #dc3545 !important; }
    #yunxuetang-monitor-panel .log-warning { color: #ffc107 !important; }
    #yunxuetang-monitor-panel .close-btn {
      background: none !important;
      border: none !important;
      color: white !important;
      font-size: 18px !important;
      cursor: pointer !important;
      padding: 0 !important;
      width: auto !important;
      margin: 0 !important;
      min-height: auto !important;
    }
    #yunxuetang-monitor-panel .info-row {
      display: flex !important;
      justify-content: space-between !important;
      margin: 3px 0 !important;
      font-size: 11px !important;
    }
    #yunxuetang-monitor-panel .info-label {
      color: #666 !important;
    }
    #yunxuetang-monitor-panel .info-value {
      font-weight: bold !important;
      color: #333 !important;
    }
    #yunxuetang-monitor-panel .course-links {
      max-height: 150px !important;
      overflow-y: auto !important;
      background: #f8f9fa !important;
      border: 1px solid #dee2e6 !important;
      border-radius: 4px !important;
      padding: 8px !important;
      margin-top: 8px !important;
    }
    #yunxuetang-monitor-panel .course-link-item {
      padding: 4px 8px !important;
      margin: 2px 0 !important;
      background: white !important;
      border: 1px solid #ddd !important;
      border-radius: 3px !important;
      font-size: 10px !important;
      cursor: pointer !important;
      transition: background-color 0.2s !important;
    }
    #yunxuetang-monitor-panel .course-link-item:hover {
      background: #e9ecef !important;
    }
    #yunxuetang-monitor-panel .course-link-title {
      font-weight: bold !important;
      color: #007bff !important;
      margin-bottom: 2px !important;
    }
    #yunxuetang-monitor-panel .course-link-url {
      color: #666 !important;
      font-size: 9px !important;
      word-break: break-all !important;
    }
    #yunxuetang-monitor-panel .current-course-item {
      background: #e3f2fd !important;
      border: 2px solid #2196f3 !important;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3) !important;
    }
    #yunxuetang-monitor-panel .current-course-badge {
      background: #2196f3 !important;
      color: white !important;
      font-size: 9px !important;
      padding: 2px 6px !important;
      border-radius: 10px !important;
      margin-top: 4px !important;
      display: inline-block !important;
      font-weight: bold !important;
    }
  `);



  // 日志记录函数
  function addLog(message, type = 'info') {
    console.log(message);
    if (controlPanel) {
      const logContainer = controlPanel.querySelector('.log');
      if (logContainer) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }
  }

  // 更新进度条
  function updateProgress(current, total, text = '') {
    extractProgress.current = current;
    extractProgress.total = total;
    if (controlPanel) {
      const progressBar = controlPanel.querySelector('.progress-bar');
      const statusDiv = controlPanel.querySelector('.extract-status');
      if (progressBar && total > 0) {
        const percentage = Math.round((current / total) * 100);
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
      }
      if (statusDiv) {
        statusDiv.textContent = text || `进度: ${current}/${total}`;
      }
    }
  }

  // 更新学习状态
  function updateLearningStatus(currentCourse, progress, status) {
    if (controlPanel) {
      const currentCourseDiv = controlPanel.querySelector('.current-course');
      const learningProgressDiv = controlPanel.querySelector('.learning-progress');
      const monitorStatusDiv = controlPanel.querySelector('.monitor-status');
      const overallProgressDiv = controlPanel.querySelector('.overall-progress');

      if (currentCourseDiv) currentCourseDiv.textContent = currentCourse || '无';
      if (learningProgressDiv) learningProgressDiv.textContent = progress || '0%';

      // 获取剩余时间并显示
      const leaveTimeElement = document.getElementById('spanLeavTimes');
      let timeLeft = '未知';
      if (leaveTimeElement && leaveTimeElement.textContent) {
        timeLeft = leaveTimeElement.textContent.trim();
      }

      if (monitorStatusDiv) {
        if (status === '监控中' || status === '监控中...') {
          monitorStatusDiv.textContent = `监控中 (剩余: ${timeLeft})`;
        } else {
          monitorStatusDiv.textContent = status || '未开始';
        }
      }

      // 更新总体进度
      if (overallProgressDiv && autoLearningState) {
        const currentIndex = autoLearningState.currentIndex || 0;
        const totalCourses = autoLearningState.courseLinks ? autoLearningState.courseLinks.length : 0;
        overallProgressDiv.textContent = `${currentIndex + 1}/${totalCourses}`;
      }
    }
  }

  // 使面板可拖拽
  function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = element.querySelector('.panel-header');

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      if (e.target === header || header.contains(e.target)) {
        isDragging = true;
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }

    function dragEnd() {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }
  }

  // 创建控制面板
  function createControlPanel() {
    if (controlPanel) {
      controlPanel.remove();
    }

    controlPanel = document.createElement('div');
    controlPanel.id = 'yunxuetang-monitor-panel';

    const isLearningPage = checkAutoLearningPage();

    controlPanel.innerHTML = `
      <div class="panel-header">
        <span>云学堂监控面板</span>
        <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">×</button>
      </div>
      <div class="panel-body">
        ${!isLearningPage ? `
        <div class="section">
          <div class="section-title">课程提取</div>
          <button id="extract-btn" class="btn-primary">提取并开始学习</button>
          <button id="pause-extract-btn" class="btn-danger" style="display: none;">暂停提取</button>
          <div class="progress">
            <div class="progress-bar" style="width: 0%">0%</div>
          </div>
          <div class="status extract-status">等待提取</div>
          <div class="info-row">
            <span class="info-label">发现课程:</span>
            <span class="info-value course-count">0</span>
          </div>
        </div>
        ` : ''}
        
        ${isLearningPage ? `
        <div class="section">
          <div class="section-title">学习监控</div>
          <div class="info-row">
            <span class="info-label">总体进度:</span>
            <span class="info-value overall-progress">0/0</span>
          </div>
          <div class="info-row">
            <span class="info-label">当前课程:</span>
            <span class="info-value current-course">无</span>
          </div>
          <div class="info-row">
            <span class="info-label">学习进度:</span>
            <span class="info-value learning-progress">0%</span>
          </div>
          <div class="info-row">
            <span class="info-label">监控状态:</span>
            <span class="info-value monitor-status">未开始</span>
          </div>
          <button id="start-monitor-btn" class="btn-success">开始监控</button>
          <button id="stop-monitor-btn" class="btn-danger">停止监控</button>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">控制操作</div>
          <button id="clear-log-btn" class="btn-secondary">清空日志</button>
          ${isLearningPage ? `<button id="show-courses-btn" class="btn-secondary">查看课程列表</button>` : ''}
        </div>
        
        ${isLearningPage ? `
        <div class="section" id="course-links-section" style="display: none;">
          <div class="section-title">课程列表</div>
          <div class="course-links"></div>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">运行日志</div>
          <div class="log"></div>
        </div>
      </div>
    `;

    document.body.appendChild(controlPanel);
    makeDraggable(controlPanel);

    // 绑定事件
    const extractBtn = controlPanel.querySelector('#extract-btn');
    const pauseExtractBtn = controlPanel.querySelector('#pause-extract-btn');
    const startMonitorBtn = controlPanel.querySelector('#start-monitor-btn');
    const stopMonitorBtn = controlPanel.querySelector('#stop-monitor-btn');
    const clearLogBtn = controlPanel.querySelector('#clear-log-btn');
    const showCoursesBtn = controlPanel.querySelector('#show-courses-btn');

    if (extractBtn) {
      extractBtn.addEventListener('click', () => {
        if (!isExtracting) {
          extractCourseLinks();
        }
      });
    }

    if (pauseExtractBtn) {
      pauseExtractBtn.addEventListener('click', () => {
        pauseExtraction();
      });
    }

    if (startMonitorBtn) {
      startMonitorBtn.addEventListener('click', () => {
        startLearningMonitor();
      });
    }

    if (stopMonitorBtn) {
      stopMonitorBtn.addEventListener('click', () => {
        if (learningMonitorInterval) {
          clearInterval(learningMonitorInterval);
          learningMonitorInterval = null;
          addLog('学习监控已停止', 'warning');
        }
      });
    }

    if (clearLogBtn) {
      clearLogBtn.addEventListener('click', () => {
        const logContainer = controlPanel.querySelector('.log');
        if (logContainer) {
          logContainer.innerHTML = '';
        }
      });
    }

    if (showCoursesBtn) {
      showCoursesBtn.addEventListener('click', () => {
        toggleCourseLinks();
      });
    }

    addLog('控制面板已初始化', 'success');
  }

  // 切换课程链接显示
  function toggleCourseLinks() {
    const courseLinksSection = controlPanel.querySelector('#course-links-section');
    const courseLinksContainer = controlPanel.querySelector('.course-links');
    const showCoursesBtn = controlPanel.querySelector('#show-courses-btn');

    if (courseLinksSection.style.display === 'none') {
      // 显示课程列表
      if (autoLearningState && autoLearningState.courseLinks) {
        courseLinksContainer.innerHTML = '';
        autoLearningState.courseLinks.forEach((course, index) => {
          if (course && course.title && course.url) {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-link-item';

            // 检查是否为当前课程
            const isCurrentCourse = autoLearningState && autoLearningState.currentIndex === index;
            if (isCurrentCourse) {
              courseItem.classList.add('current-course-item');
            }

            courseItem.innerHTML = `
               <div class="course-link-title">${index + 1}. ${course.title}</div>
               <div class="course-link-url">${course.url}</div>
               ${isCurrentCourse ? '<div class="current-course-badge">当前课程</div>' : ''}
             `;
            courseItem.addEventListener('click', () => {
              window.open(course.url, '_blank');
            });
            courseLinksContainer.appendChild(courseItem);
          }
        });
        courseLinksSection.style.display = 'block';
        showCoursesBtn.textContent = '隐藏课程列表';
        addLog(`显示课程列表，共 ${autoLearningState.courseLinks.length} 门课程`, 'info');

        // 自动滚动到当前课程
        setTimeout(() => {
          scrollToCurrentCourse();
        }, 100);
      } else {
        addLog('暂无课程数据', 'warning');
      }
    } else {
      // 隐藏课程列表
      courseLinksSection.style.display = 'none';
      showCoursesBtn.textContent = '查看课程列表';
    }
  }

  // 滚动到当前课程
  function scrollToCurrentCourse() {
    const courseLinksContainer = controlPanel.querySelector('.course-links');
    const currentCourseItem = courseLinksContainer.querySelector('.current-course-item');

    if (currentCourseItem && courseLinksContainer) {
      // 计算滚动位置，让当前课程居中显示
      const containerHeight = courseLinksContainer.clientHeight;
      const itemHeight = currentCourseItem.offsetHeight;
      const itemTop = currentCourseItem.offsetTop;
      const scrollTop = itemTop - (containerHeight / 2) + (itemHeight / 2);

      courseLinksContainer.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });

      addLog(`已滚动到当前课程位置 (第${autoLearningState.currentIndex + 1}门)`, 'info');
    }
  }

  // 检查并设置视频播放倍数为2x
  function checkAndSetVideoSpeed() {
    // 检查当前课程是否为视频课程（非PDF）
    const currentUrl = window.location.href;
    const isVideoCourse = !currentUrl.includes('.pdf') &&
      (currentUrl.includes('/video/') || currentUrl.includes('/package/video/'));

    if (!isVideoCourse) {
      return; // 不是视频课程，跳过
    }

    // 检查是否已经设置过2x倍数
    if (window.videoSpeedSet) {
      return; // 已经设置过，避免重复设置
    }

    // 设置标志，防止重复调用
    window.videoSpeedSet = true;
    addLog('检测到视频课程，准备设置播放倍数为2x', 'info');

    // 等待播放器加载完成
    setTimeout(() => {
      try {
        // 方法1：通过播放器API设置倍数
        if (typeof player !== 'undefined' && player && player.bdPlayer) {
          try {
            const currentRate = player.bdPlayer.getPlaybackRate();
            if (currentRate !== 2) {
              player.bdPlayer.setPlaybackRate(2);
              addLog('通过播放器API设置视频倍数为2x', 'success');
              return;
            } else {
              addLog('视频倍数已经是2x', 'info');
              return;
            }
          } catch (e) {
            addLog('播放器API设置失败，尝试DOM操作: ' + e.message, 'warning');
          }
        }

        // 方法2：通过DOM操作点击2x选项
        const playRateButton = document.querySelector('.jw-icon-playrate');
        if (playRateButton) {
          addLog('找到播放倍数按钮，准备点击设置2x', 'info');

          // 点击播放倍数按钮打开菜单
          playRateButton.click();

          setTimeout(() => {
            // 查找2x选项并点击
            const rate2xOption = document.querySelector('.jw-option[data-rate="2"]') ||
              Array.from(document.querySelectorAll('.jw-option')).find(option =>
                option.textContent.includes('×2') || option.textContent.includes('2')
              );

            if (rate2xOption) {
              rate2xOption.click();
              addLog('通过DOM操作设置视频倍数为2x', 'success');
            } else {
              addLog('未找到2x倍数选项，尝试其他方法', 'warning');
              // 尝试直接通过播放器对象设置
              trySetVideoSpeedDirectly();
            }
          }, 500);
        } else {
          addLog('未找到播放倍数按钮，尝试直接设置', 'warning');
          trySetVideoSpeedDirectly();
        }
      } catch (error) {
        addLog('设置视频倍数时出错: ' + error.message, 'error');
      }
    }, 2000); // 等待2秒确保播放器完全加载
  }


  // 直接设置视频倍数的备用方法
  function trySetVideoSpeedDirectly() {
    try {
      // 方法3：通过全局变量设置
      if (typeof window.player !== 'undefined' && window.player) {
        if (typeof window.player.setPlaybackRate === 'function') {
          window.player.setPlaybackRate(2);
          addLog('通过全局播放器对象设置视频倍数为2x', 'success');
          return;
        }
      }

      // 方法4：通过视频元素直接设置
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.playbackRate = 2;
        addLog('通过video元素直接设置播放倍数为2x', 'success');
        return;
      }

      // 方法5：通过YxtVideoPlayer实例设置
      if (typeof window.player !== 'undefined' && window.player.bdPlayer) {
        if (typeof window.player.bdPlayer.setPlaybackRate === 'function') {
          window.player.bdPlayer.setPlaybackRate(2);
          addLog('通过YxtVideoPlayer实例设置视频倍数为2x', 'success');
          return;
        }
      }

      addLog('所有方法都失败，无法设置视频倍数', 'error');
    } catch (e) {
      addLog('直接设置视频倍数失败: ' + e.message, 'error');
    }
  }

  // 暂停提取函数
  function pauseExtraction() {
    if (isExtracting) {
      isExtracting = false;
      addLog('用户暂停了课程提取', 'warning');
      updateProgress(0, 0, '提取已暂停');

      // 重置按钮状态
      resetExtractButtons();
    }
  }

  // 重置提取按钮状态
  function resetExtractButtons() {
    const extractBtn = controlPanel.querySelector('#extract-btn');
    const pauseExtractBtn = controlPanel.querySelector('#pause-extract-btn');
    if (extractBtn) {
      extractBtn.style.display = 'block';
      extractBtn.textContent = '提取并开始学习';
    }
    if (pauseExtractBtn) {
      pauseExtractBtn.style.display = 'none';
    }
  }

  // 提取具体课程链接的函数
  function extractCourseLinks() {
    if (isExtracting) {
      addLog('提取正在进行中，请等待...', 'warning');
      return;
    }

    isExtracting = true;
    addLog('开始提取具体课程链接...', 'info');
    updateProgress(0, 1, '正在扫描页面...');

    // 更新按钮状态
    const extractBtn = controlPanel.querySelector('#extract-btn');
    const pauseExtractBtn = controlPanel.querySelector('#pause-extract-btn');
    if (extractBtn) {
      extractBtn.style.display = 'none';
    }
    if (pauseExtractBtn) {
      pauseExtractBtn.style.display = 'block';
    }

    // 获取当前页面的所有课程链接
    const packageLinks = [];
    const directCourseLinks = [];
    const rows = document.querySelectorAll('tr[onclick*="StudyRowClick"]');

    addLog(`发现 ${rows.length} 个课程行`, 'info');
    updateProgress(1, 3, '正在分析课程链接...');

    rows.forEach((row, index) => {
      const onclickAttr = row.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes('StudyRowClick')) {
        const match = onclickAttr.match(/StudyRowClick\('([^']+)'/);
        if (match && match[1]) {
          const originalPath = match[1];

          // 检查是否为直接课程链接（新格式）
          if (originalPath.includes('/plan/video/') || originalPath.includes('/plan/document/')) {
            const fullUrl = 'https://asiainfo.yunxuetang.cn/kng' + originalPath;

            // 获取课程标题
            const titleElement = row.querySelector('.st');
            const title = titleElement ? (titleElement.textContent || titleElement['innerText'] || titleElement.getAttribute('title') || `课程${index + 1}`).trim() : `课程${index + 1}`;

            // 确定课程类型
            const courseType = originalPath.includes('/plan/video/') ? 'video' : 'document';

            directCourseLinks.push({
              title: title,
              url: fullUrl,
              originalPath: originalPath,
              type: courseType,
              packageTitle: '直接课程'
            });
          }
          // 检查是否为课程包链接（原有格式和新格式）
          else if (originalPath.includes('/package/') || originalPath.includes('/plan/package/')) {
            const fullUrl = 'https://asiainfo.yunxuetang.cn/kng' + originalPath;

            // 获取课程标题
            const titleElement = row.querySelector('.ellipsis a, .ellipsis, .st');
            const title = titleElement ? (titleElement.textContent || titleElement['innerText'] || titleElement.getAttribute('title') || `课程${index + 1}`).trim() : `课程${index + 1}`;

            packageLinks.push({
              title: title,
              url: fullUrl,
              originalPath: originalPath
            });
          }
        }
      }
    });

    // 统一处理所有类型的链接
    // 更新课程数量显示
    const totalCourses = directCourseLinks.length + packageLinks.length;
    if (controlPanel) {
      const courseCountDiv = controlPanel.querySelector('.course-count');
      if (courseCountDiv) {
        courseCountDiv.textContent = totalCourses.toString();
      }
    }

    updateProgress(2, 3, '正在处理课程链接...');

    if (directCourseLinks.length > 0 && packageLinks.length > 0) {
      // 既有直接课程链接又有课程包链接，需要合并处理
      addLog(`找到 ${directCourseLinks.length} 个直接课程链接和 ${packageLinks.length} 个课程包`, 'success');
      addLog('提取到的直接课程链接: ' + directCourseLinks.map(c => c.title).join(', '), 'info');

      // 先处理课程包获取具体课程链接，然后与直接课程链接合并
      processCoursePackagesWithDirectLinks(packageLinks, directCourseLinks);
    } else if (directCourseLinks.length > 0) {
      // 只有直接课程链接
      addLog(`找到 ${directCourseLinks.length} 个直接课程链接，开始自动学习循环`, 'success');
      addLog('提取到的直接课程链接: ' + directCourseLinks.map(c => c.title).join(', '), 'info');
      updateProgress(3, 3, '开始学习循环...');
      startAutoLearningLoop(directCourseLinks);
      isExtracting = false;
      resetExtractButtons();
    } else if (packageLinks.length > 0) {
      // 只有课程包链接
      addLog(`找到 ${packageLinks.length} 个课程包，开始获取具体课程链接...`, 'info');
      processCoursePackages(packageLinks);
    } else {
      addLog('❌ 未找到课程包链接或直接课程链接！', 'error');
      updateProgress(0, 1, '未找到课程');
      isExtracting = false;
      resetExtractButtons();
    }
  }

  // 处理既有直接课程链接又有课程包链接的情况
  async function processCoursePackagesWithDirectLinks(packageLinks, directCourseLinks) {
    const allCourseLinks = [...directCourseLinks]; // 先添加直接课程链接
    addLog(`开始处理 ${packageLinks.length} 个课程包...`, 'info');

    for (let i = 0; i < packageLinks.length; i++) {
      // 检查是否被用户暂停
      if (!isExtracting) {
        addLog('提取已被用户暂停', 'warning');
        return;
      }

      const packageInfo = packageLinks[i];
      addLog(`正在处理第 ${i + 1}/${packageLinks.length} 个课程包: ${packageInfo.title}`, 'info');
      updateProgress(i, packageLinks.length, `处理课程包: ${packageInfo.title}`);

      try {
        const courseLinks = await fetchCourseLinksFromPackage(packageInfo);
        allCourseLinks.push(...courseLinks);
        addLog(`课程包 ${packageInfo.title} 包含 ${courseLinks.length} 个课程`, 'success');

        // 添加延迟避免请求过快
        if (i < packageLinks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        addLog(`处理课程包 ${packageInfo.title} 时出错: ${error.message}`, 'error');
      }
    }

    // 输出结果并开始自动学习循环
    if (allCourseLinks.length > 0) {
      addLog(`成功提取 ${allCourseLinks.length} 个课程链接（包含 ${directCourseLinks.length} 个直接链接）`, 'success');
      updateProgress(packageLinks.length, packageLinks.length, '开始学习循环...');

      // 开始自动学习循环
      startAutoLearningLoop(allCourseLinks);
    } else {
      addLog('未找到任何课程链接！', 'error');
    }

    isExtracting = false;
    resetExtractButtons();
  }

  // 处理课程包的异步函数
  async function processCoursePackages(packageLinks) {
    const allCourseLinks = [];
    addLog(`开始处理 ${packageLinks.length} 个课程包...`, 'info');

    for (let i = 0; i < packageLinks.length; i++) {
      // 检查是否被用户暂停
      if (!isExtracting) {
        addLog('提取已被用户暂停', 'warning');
        return;
      }

      const packageInfo = packageLinks[i];
      addLog(`正在处理第 ${i + 1}/${packageLinks.length} 个课程包: ${packageInfo.title}`, 'info');
      updateProgress(i, packageLinks.length, `处理课程包: ${packageInfo.title}`);

      try {
        const courseLinks = await fetchCourseLinksFromPackage(packageInfo);
        allCourseLinks.push(...courseLinks);
        addLog(`课程包 ${packageInfo.title} 包含 ${courseLinks.length} 个课程`, 'success');

        // 添加延迟避免请求过快
        if (i < packageLinks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        addLog(`处理课程包 ${packageInfo.title} 时出错: ${error.message}`, 'error');
      }
    }

    // 输出结果并开始自动学习循环
    if (allCourseLinks.length > 0) {
      addLog(`成功提取 ${allCourseLinks.length} 个具体课程链接`, 'success');
      updateProgress(packageLinks.length, packageLinks.length, '开始学习循环...');

      // 开始自动学习循环
      startAutoLearningLoop(allCourseLinks);
    } else {
      addLog('未找到任何具体课程链接！', 'error');
    }

    isExtracting = false;
    resetExtractButtons();
  }

  // 从课程包页面获取具体课程链接
  async function fetchCourseLinksFromPackage(packageInfo) {
    return new Promise((resolve, reject) => {
      // 使用GM_xmlhttpRequest发送请求
      if (typeof window['GM_xmlhttpRequest'] === 'function') {
        window['GM_xmlhttpRequest']({
          method: 'GET',
          url: packageInfo.url,
          headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache'
          },
          onload: function (response) {
            if (response.status === 200) {
              const courseLinks = parseCourseLinksFromHTML(response.responseText, packageInfo.title);
              addLog(`成功获取课程包 "${packageInfo.title}" 中的 ${courseLinks.length} 个课程`, 'success');
              resolve(courseLinks);
            } else {
              const errorMsg = `获取课程包失败: ${packageInfo.title}, 状态码: ${response.status}`;
              console.error(errorMsg);
              addLog(errorMsg, 'error');
              resolve([]);
            }
          },
          onerror: function (error) {
            const errorMsg = `网络错误，无法获取课程包: ${packageInfo.title}`;
            console.error(errorMsg, error);
            addLog(errorMsg, 'error');
            resolve([]);
          },
          ontimeout: function () {
            const errorMsg = `请求超时，无法获取课程包: ${packageInfo.title}`;
            console.error(errorMsg);
            addLog(errorMsg, 'error');
            resolve([]);
          },
          timeout: 10000
        });
      } else {
        // 如果GM_xmlhttpRequest不可用，使用fetch作为备选
        fetch(packageInfo.url)
          .then(response => response.text())
          .then(html => {
            const courseLinks = parseCourseLinksFromHTML(html, packageInfo.title);
            addLog(`成功获取课程包 "${packageInfo.title}" 中的 ${courseLinks.length} 个课程`, 'success');
            resolve(courseLinks);
          })
          .catch(error => {
            const errorMsg = `获取课程包失败: ${packageInfo.title} - ${error.message}`;
            console.error(errorMsg, error);
            addLog(errorMsg, 'error');
            resolve([]);
          });
      }
    });
  }

  // 解析HTML内容，提取课程链接
  function parseCourseLinksFromHTML(html, packageTitle) {
    const courseLinks = [];

    // 创建临时DOM来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 查找包含StudyRowClick的链接，匹配/package/video/、/package/document/、/plan/video/或/plan/document/
    const linkPatterns = [
      /StudyRowClick\('(\/package\/(video|document)\/[^']+\.html[^']*)'[^)]*\)/g,
      /StudyRowClick\('(\/plan\/(video|document)\/[^']+\.html[^']*)'[^)]*\)/g
    ];

    linkPatterns.forEach(linkPattern => {
      let match;
      while ((match = linkPattern.exec(html)) !== null) {
        const originalPath = match[1];
        const courseType = match[2]; // video 或 document

        // 构建最终的课程URL
        const finalUrl = 'https://asiainfo.yunxuetang.cn/kng/course' + originalPath;

        // 尝试从HTML中提取课程标题
        let courseTitle = `${packageTitle} - ${courseType === 'video' ? '视频' : '文档'}课程`;

        // 尝试从StudyRowClick附近的HTML中提取更精确的标题
        const titleMatch = html.match(new RegExp(`StudyRowClick\\('${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^']*'[^>]*>([^<]+)<`, 'i'));
        if (titleMatch && titleMatch[1]) {
          courseTitle = titleMatch[1].trim();
        }

        courseLinks.push({
          title: courseTitle,
          url: finalUrl,
          originalPath: originalPath,
          packageTitle: packageTitle,
          type: courseType
        });
      }
    });

    addLog(`从 ${packageTitle} 中提取到 ${courseLinks.length} 个具体课程链接`, 'success');
    if (courseLinks.length > 0) {
      addLog('提取到的课程链接: ' + courseLinks.map(link => `${link.title} (${link.type})`).join(', '), 'info');
    }
    return courseLinks;
  }

  // 自动学习循环系统
  let autoLearningState = {
    courseLinks: [],
    currentIndex: 0,
    isRunning: false,
    completedCount: 0,
    skippedCount: 0
  };

  // 从localStorage恢复自动学习状态
  function loadAutoLearningState() {
    try {
      const savedState = localStorage.getItem('yunxuetang_auto_learning_state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        autoLearningState = {
          courseLinks: parsed.courseLinks || [],
          currentIndex: parsed.currentIndex || 0,
          isRunning: parsed.isRunning || false,
          completedCount: parsed.completedCount || 0,
          skippedCount: parsed.skippedCount || 0
        };
        addLog('已恢复自动学习状态', 'success');
      }
    } catch (e) {
      addLog('恢复自动学习状态失败: ' + e.message, 'error');
    }
  }

  // 保存自动学习状态到localStorage
  function saveAutoLearningState() {
    try {
      localStorage.setItem('yunxuetang_auto_learning_state', JSON.stringify(autoLearningState));
    } catch (e) {
      addLog('保存自动学习状态失败: ' + e.message, 'error');
    }
  }

  // 清除自动学习状态
  function clearAutoLearningState() {
    try {
      localStorage.removeItem('yunxuetang_auto_learning_state');
      autoLearningState = {
        courseLinks: [],
        currentIndex: 0,
        isRunning: false,
        completedCount: 0,
        skippedCount: 0
      };
    } catch (e) {
      addLog('清除自动学习状态失败: ' + e.message, 'error');
    }
  }

  // 开始自动学习循环
  function startAutoLearningLoop(courseLinks) {
    autoLearningState = {
      courseLinks: courseLinks,
      currentIndex: 0,
      isRunning: true,
      completedCount: 0,
      skippedCount: 0
    };

    // 保存状态到localStorage
    saveAutoLearningState();

    addLog(`开始自动学习循环，共 ${courseLinks.length} 个课程`, 'info');
    processNextCourse();
  }

  // 处理下一个课程
  function processNextCourse() {
    if (!autoLearningState.isRunning || autoLearningState.currentIndex >= autoLearningState.courseLinks.length) {
      // 学习循环完成
      const totalCourses = autoLearningState.courseLinks.length;
      const completed = autoLearningState.completedCount;
      const skipped = autoLearningState.skippedCount;

      addLog(`🎉 自动学习循环完成！总课程: ${totalCourses}, 新完成: ${completed}, 已跳过: ${skipped}`, 'success');
      notifyUser(`自动学习完成！共 ${totalCourses} 门课程，新完成 ${completed} 门`);

      // 清除自动学习状态
      clearAutoLearningState();
      return;
    }

    const currentCourse = autoLearningState.courseLinks[autoLearningState.currentIndex];
    const progress = `[${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}]`;

    addLog(`${progress} 准备访问课程: ${currentCourse.title}`, 'info');
    addLog(`${progress} 课程链接: ${currentCourse.url}`, 'info');

    // 保存当前状态
    saveAutoLearningState();

    // 重置页面加载时间计时器和调试标志
    window.lastPageLoadTime = null;
    window.courseCompletionCheckStarted = false;
    window.videoSpeedSet = false; // 重置视频倍数标志

    // 跳转到课程页面
    window.location.href = currentCourse.url;
  }

  // 根据当前URL查找对应的课程索引
  function findCourseIndexByUrl(currentUrl) {
    if (!autoLearningState || !autoLearningState.courseLinks) {
      return -1;
    }

    // 提取当前URL的关键部分用于匹配
    for (let i = 0; i < autoLearningState.courseLinks.length; i++) {
      const course = autoLearningState.courseLinks[i];
      if (course.url && currentUrl.includes(course.url)) {
        return i;
      }

      // 如果直接URL匹配失败，尝试提取课程ID进行匹配
      const currentUrlMatch = currentUrl.match(/courseId=(\d+)/);
      const courseUrlMatch = course.url.match(/courseId=(\d+)/);

      if (currentUrlMatch && courseUrlMatch && currentUrlMatch[1] === courseUrlMatch[1]) {
        return i;
      }
    }

    return -1;
  }

  // 检查当前页面是否为自动学习模式下的课程页面
  function checkAutoLearningPage() {
    if (!autoLearningState.isRunning) {
      return false;
    }

    const currentUrl = window.location.href;

    // 根据当前URL查找正确的课程索引
    const actualCourseIndex = findCourseIndexByUrl(currentUrl);

    if (actualCourseIndex !== -1 && actualCourseIndex !== autoLearningState.currentIndex) {
      addLog(`检测到课程索引不匹配，从索引 ${autoLearningState.currentIndex} 更新为 ${actualCourseIndex}`, 'warning');
      autoLearningState.currentIndex = actualCourseIndex;
      saveAutoLearningState();
    }

    const currentCourse = autoLearningState.courseLinks[autoLearningState.currentIndex];

    // 检查当前URL是否匹配预期的课程URL
    if (currentUrl.includes('/kng/course/package/') || currentUrl.includes('/kng/plan/')) {
      const progress = `[${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}]`;
      addLog(`${progress} 已进入课程页面: ${currentCourse ? currentCourse.title : '未知课程'}`, 'info');

      // 检查课程是否已完成
      if (checkCourseCompletion()) {
        addLog(`${progress} 课程已完成，跳转到下一个`, 'success');
        autoLearningState.skippedCount++;
        autoLearningState.currentIndex++;

        // 保存状态
        saveAutoLearningState();

        // 延迟跳转到下一个课程
        setTimeout(() => {
          processNextCourse();
        }, 2000);

        return true;
      } else {
        addLog(`${progress} 课程未完成，开始学习监控`, 'info');
        // 开始监控学习进度
        startLearningMonitor();
        return true;
      }
    }

    return false;
  }

  // 检查课程完成状态
  function checkCourseCompletion() {
    // 首先检查页面是否已完全加载（避免页面加载初期的误判）
    const videoElement = document.querySelector('video');
    const scheduleElement = document.querySelector('#ScheduleText');
    const countdownElement = document.querySelector('#spanLeavTimes');

    // 多重检查确保页面真正加载完成
    const pageFullyLoaded = document.readyState === 'complete' &&
      (videoElement || scheduleElement || countdownElement) &&
      document.body &&
      document.body.children.length > 0;

    // 如果页面未完全加载，直接返回false
    if (!pageFullyLoaded) {
      // 添加调试日志
      const readyState = document.readyState;
      const hasVideo = !!videoElement;
      const hasSchedule = !!scheduleElement;
      const hasCountdown = !!countdownElement;
      const hasBody = !!document.body;
      addLog(`页面未完全加载 - readyState: ${readyState}, video: ${hasVideo}, schedule: ${hasSchedule}, countdown: ${hasCountdown}, body: ${hasBody}`, 'debug');
      return false;
    }

    // 检查并设置视频播放倍数为2x
    checkAndSetVideoSpeed();

    // 额外等待确保DOM元素稳定（避免元素刚出现但内容未更新的情况）
    const currentTime = Date.now();
    if (!window.lastPageLoadTime) {
      window.lastPageLoadTime = currentTime;
      addLog('页面加载完成，开始1秒等待期确保DOM稳定', 'debug');
      return false; // 第一次检测时先等待
    }

    // 页面加载后至少等待1秒再进行检测
    const waitTime = currentTime - window.lastPageLoadTime;
    if (waitTime < 1000) {
      addLog(`DOM稳定等待中... (${waitTime}/1000ms)`, 'debug');
      return false;
    }

    // 避免重复输出相同的调试信息
    if (!window.courseCompletionCheckStarted) {
      addLog('页面加载检测通过，开始课程完成状态检测', 'debug');
      window.courseCompletionCheckStarted = true;
    }

    // 检查进度是否达到100%
    if (scheduleElement) {
      const scheduleText = scheduleElement.textContent || scheduleElement['innerText'] || '';
      const progressMatch = scheduleText.match(/(\d+(?:\.\d+)?)%/);
      if (progressMatch) {
        const progress = parseFloat(progressMatch[1]);
        if (progress >= 100) {
          addLog('检测到课程进度已达到 ' + progress + '%', 'success');
          return true;
        }
      }
    }

    // 检查是否有完成提示
    const completedArea = document.querySelector('#divCompletedArea');
    if (completedArea && completedArea['style'].display !== 'none') {
      const completedText = completedArea.textContent || completedArea['innerText'] || '';
      if (completedText.includes('恭喜您，您已完成本视频的学习')) {
        addLog('检测到课程完成提示', 'success');
        return true;
      }
    }

    // 检查倒计时是否为0
    if (countdownElement) {
      const countdownText = countdownElement.textContent || countdownElement['innerText'] || '';

      // 倒计时为0时判断为完成
      if (countdownText.includes('0分钟0秒') || countdownText.includes('00:00')) {
        // 额外检查：确保不是页面刚加载时的初始状态
        if (scheduleElement) {
          const scheduleText = scheduleElement.textContent || scheduleElement['innerText'] || '';
          const progressMatch = scheduleText.match(/(\d+(?:\.\d+)?)%/);
          if (progressMatch) {
            const progress = parseFloat(progressMatch[1]);
            // 只有进度大于0%时，倒计时为0才认为是真正完成
            if (progress > 0) {
              addLog(`检测到倒计时已结束且学习进度为 ${progress}%`, 'warning');
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  // 开始学习监控（复用现有逻辑）
  function startLearningMonitor() {
    // 确保当前索引是正确的
    const currentUrl = window.location.href;
    const actualCourseIndex = findCourseIndexByUrl(currentUrl);

    if (actualCourseIndex !== -1 && actualCourseIndex !== autoLearningState.currentIndex) {
      addLog(`监控开始前检测到课程索引不匹配，从索引 ${autoLearningState.currentIndex} 更新为 ${actualCourseIndex}`, 'warning');
      autoLearningState.currentIndex = actualCourseIndex;
      saveAutoLearningState();
    }

    const courseInfo = autoLearningState ? (autoLearningState.courseLinks[autoLearningState.currentIndex] && autoLearningState.courseLinks[autoLearningState.currentIndex].title) || '当前课程' : '当前课程';
    addLog(`🎯 开始监控课程学习进度: ${courseInfo}`, 'info');
    addLog('⏰ 监控间隔: 5秒，超时时间: 180分钟', 'info');

    // 更新控制面板状态
    if (autoLearningState) {
      const currentCourse = autoLearningState.courseLinks[autoLearningState.currentIndex];
      const courseTitle = currentCourse && currentCourse.title ? currentCourse.title : '未知课程';
      updateLearningStatus(courseTitle, '0%', '监控中');
    }

    // 设置监控间隔
    learningMonitorInterval = setInterval(() => {
      // 检查当前页面的课程索引是否正确
      if (autoLearningState) {
        const currentUrl = window.location.href;
        const actualCourseIndex = findCourseIndexByUrl(currentUrl);

        if (actualCourseIndex !== -1 && actualCourseIndex !== autoLearningState.currentIndex) {
          addLog(`监控中检测到课程索引不匹配，从索引 ${autoLearningState.currentIndex} 更新为 ${actualCourseIndex}`, 'warning');
          autoLearningState.currentIndex = actualCourseIndex;

          // 更新总体进度显示
          const overallProgressDiv = controlPanel.querySelector('.overall-progress');
          if (overallProgressDiv) {
            overallProgressDiv.textContent = `${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}`;
          }

          saveAutoLearningState();
        }
      }

      const currentTime = new Date().toLocaleTimeString();
      const progress = autoLearningState ? `[${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}]` : '[单独监控]';

      // 更新学习状态到控制面板
      if (autoLearningState) {
        const currentCourse = autoLearningState.courseLinks[autoLearningState.currentIndex];
        const progressPercent = Math.round(((autoLearningState.currentIndex + 1) / autoLearningState.courseLinks.length) * 100);
        updateLearningStatus(currentCourse ? (currentCourse.title || '未知课程') : '未知课程', `${progressPercent}%`, '监控中...');

        // 更新总体进度显示
        const overallProgressDiv = controlPanel.querySelector('.overall-progress');
        if (overallProgressDiv) {
          overallProgressDiv.textContent = `${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}`;
        }
      }

      // 检查并处理"继续学习"弹窗
      checkAndClickContinueButton();

      if (checkCourseCompletion()) {
        clearInterval(learningMonitorInterval);

        const progress = `[${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}]`;
        const currentCourse = autoLearningState.courseLinks[autoLearningState.currentIndex];

        addLog(`${progress} 课程学习完成: ${currentCourse.title}`, 'success');
        autoLearningState.completedCount++;
        autoLearningState.currentIndex++;

        // 更新总体进度显示
        const overallProgressDiv = controlPanel.querySelector('.overall-progress');
        if (overallProgressDiv) {
          overallProgressDiv.textContent = `${autoLearningState.currentIndex + 1}/${autoLearningState.courseLinks.length}`;
        }

        // 保存状态
        saveAutoLearningState();

        // 延迟跳转到下一个课程
        setTimeout(() => {
          processNextCourse();
        }, 3000);
      }
    }, 5000); // 每5秒检查一次

    // 设置超时保护（180分钟）
    setTimeout(() => {
      clearInterval(learningMonitorInterval);
      addLog('课程学习监控超时，跳转到下一个课程', 'warning');
      autoLearningState.currentIndex++;
      processNextCourse();
    }, 180 * 60 * 1000);
  }



  // 等待页面完全加载
  function waitForPageLoad() {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        setTimeout(resolve, 2000); // 额外等待2秒确保动态内容加载
      } else {
        window.addEventListener('load', () => {
          setTimeout(resolve, 2000);
        });
      }
    });
  }

  // 自动滚动功能
  function performAutoScroll() {
    addLog('🔄 开始执行自动滚动，保持页面活跃状态 - 时间: ' + new Date().toLocaleTimeString(), 'info');

    // 检查并处理"继续学习"弹窗
    checkAndClickContinueButton();

    // 记录当前滚动位置
    const currentScrollY = window.scrollY;
    addLog('📍 当前滚动位置: ' + currentScrollY, 'info');

    // 第一步：平滑滚动到底部
    addLog('⬇️ 开始滚动到页面底部', 'info');
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });

    // 等待2秒后滚动到顶部
    setTimeout(() => {
      addLog('⬆️ 开始滚动到页面顶部', 'info');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // 再等待1.5秒后回到原位置
      setTimeout(() => {
        addLog('🎯 回到原始位置: ' + currentScrollY, 'info');
        window.scrollTo({
          top: currentScrollY,
          behavior: 'smooth'
        });
        addLog('✅ 自动滚动完成，下次执行时间: ' + new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(), 'success');
        addLog('滚动已恢复到原位置', 'info');
      }, 1500);
    }, 2000);
  }

  // 连续检测计数器
  let continueButtonClickCount = 0;
  let lastContinueButtonDetectTime = 0;

  // 检查并自动点击"继续学习"按钮
  function checkAndClickContinueButton() {
    const continueButton = document.querySelector('#reStartStudy');
    const warningView = document.querySelector('#dvWarningView');

    if (continueButton && warningView) {
      // 检查弹窗是否可见
      const style = window.getComputedStyle(warningView);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        const currentTime = Date.now();

        // 如果距离上次检测时间超过30秒，重置计数器
        if (currentTime - lastContinueButtonDetectTime > 30000) {
          continueButtonClickCount = 0;
        }

        continueButtonClickCount++;
        lastContinueButtonDetectTime = currentTime;

        addLog(`检测到"继续学习"弹窗，第${continueButtonClickCount}次尝试点击继续学习按钮`, 'warning');
        continueButton['click']();

        // 如果连续检测到10次且点击无效，尝试刷新页面
        if (continueButtonClickCount >= 10) {
          addLog('连续检测到"继续学习"弹窗10次，点击可能无效，尝试刷新页面解决问题', 'error');
          continueButtonClickCount = 0; // 重置计数器
          setTimeout(() => {
            addLog('正在刷新页面以解决"继续学习"按钮无响应问题...', 'warning');
            window.location.reload();
          }, 2000); // 延迟2秒后刷新，给最后一次点击一些时间
        }

        return true;
      }
    }

    // 如果没有检测到弹窗，重置计数器
    if (Date.now() - lastContinueButtonDetectTime > 60000) {
      continueButtonClickCount = 0;
    }

    return false;
  }

  // 启动自动滚动定时器
  function startAutoScroll() {
    // 每3分钟执行一次自动滚动
    autoScrollInterval = setInterval(performAutoScroll, 3 * 60 * 1000);
    addLog('自动滚动功能已启动，每3分钟执行一次，下次执行时间: ' + new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(), 'info');

    // 立即执行一次自动滚动
    setTimeout(() => {
      addLog('执行首次自动滚动', 'info');
      performAutoScroll();
    }, 5000); // 5秒后执行首次滚动
  }

  // 停止自动滚动
  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
      addLog('自动滚动功能已停止', 'info');
    }
  }

  // 检测是否为学习页面
  function isLearningPage() {
    // 检查URL是否包含课程相关路径
    const url = window.location.href;
    return url.startsWith('https://asiainfo.yunxuetang.cn/kng/course/package/video') || url.startsWith('https://asiainfo.yunxuetang.cn/kng/course/package/document')
  }



  // 获取当前页面的课程标题
  function getCurrentCourseTitle() {
    // 直接使用页面标题
    const pageTitle = document.title;
    if (pageTitle && pageTitle !== '云学堂') {
      return pageTitle;
    }
    return '当前课程';
  }

  // 简化通知函数 - 仅使用控制台日志，不显示浏览器通知
  function notifyUser(message, courseTitle = null) {
    // 获取课程标题
    const currentCourseTitle = courseTitle || getCurrentCourseTitle();
    const fullMessage = `课程：${currentCourseTitle}\n${message}`;

    // 仅控制台输出，不显示浏览器通知
    addLog('🎉 云学堂监控通知: ' + fullMessage, 'success');
  }

  // 不再请求通知权限，因为已禁用浏览器通知

  // 监控状态
  let lastLeaveTime = '';
  let lastProgress = '';
  let lastLogTime = 0; // 用于控制日志输出频率

  // 监控函数
  function checkConditions() {
    if (notificationShown || !pageLoaded) return;

    // 检查倒计时元素
    const leaveTimeElement = document.getElementById('spanLeavTimes');
    if (leaveTimeElement && leaveTimeElement.textContent) {
      const timeText = leaveTimeElement.textContent.trim();
      if (timeText !== lastLeaveTime) {
        lastLeaveTime = timeText;
        // 只在每30秒输出一次倒计时日志，减少日志频率
        const currentTime = Date.now();
        if (currentTime - lastLogTime > 30000) {
          addLog('当前倒计时: ' + timeText, 'info');
          lastLogTime = currentTime;
        }
      }

      // 只在倒计时真正结束时通知（0分钟0秒或类似格式）
      if (timeText.match(/^0[分:]0[0秒]?$/) || timeText === '0分钟0秒' || timeText === '00:00' || timeText === '0分钟') {
        addLog('倒计时已结束!', 'success');
        notifyUser('倒计时已结束！');
        notificationShown = true;
        return;
      }
    }

    // 检查进度元素
    const progressElement = document.getElementById('ScheduleText');
    if (progressElement && progressElement.textContent) {
      const progressText = progressElement.textContent.trim();
      if (progressText !== lastProgress) {
        lastProgress = progressText;
        addLog('当前进度: ' + progressText, 'info');
      }

      // 检查是否显示 "100%" 或接近100%
      const progressMatch = progressText.match(/(\d+(?:\.\d+)?)%/);
      if (progressMatch) {
        const progressValue = parseFloat(progressMatch[1]);
        if (progressValue >= 99.5) {
          addLog('学习进度已达到100%!', 'success');
          notifyUser('学习进度已完成！当前进度: ' + progressText);
          notificationShown = true;
          return;
        }
      }
    }

    // 检查完成提示元素
    const finishElement = document.getElementById('spanFinishContent');
    const completedArea = document.getElementById('divCompletedArea');

    // 检查完成区域是否显示
    if (completedArea && completedArea.style.display !== 'none') {
      if (finishElement && finishElement.textContent) {
        const finishText = finishElement.textContent.trim();
        addLog('完成状态: ' + finishText, 'info');

        // 检查是否包含 "恭喜您已完成本视频的学习"
        if (finishText.includes('恭喜您已完成本视频的学习')) {
          addLog('视频学习已完成!', 'success');
          notifyUser('视频学习完成！' + finishText);
          notificationShown = true;
          return;
        }
      }
    }
  }

  // 启动监控
  addLog('云学堂监控脚本已启动，等待页面加载完成...', 'info');

  // 等待页面加载完成后再开始监控
  waitForPageLoad().then(() => {
    pageLoaded = true;
    addLog('页面加载完成，开始监控学习状态', 'success');

    // 恢复自动学习状态
    loadAutoLearningState();

    // 检查是否为自动学习模式下的课程页面
    if (checkAutoLearningPage()) {
      addLog('检测到自动学习模式，已处理当前页面', 'info');
    }

    // 使用 MutationObserver 监控DOM变化
    const observer = new MutationObserver(checkConditions);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 定期检查作为备用方案
    setInterval(checkConditions, 10000); // 每10秒检查一次

    // 只在学习页面启动自动滚动功能
    if (isLearningPage()) {
      startAutoScroll();
      addLog('检测到学习页面，已启动自动滚动功能', 'info');

      // 检查并设置视频播放倍数
      checkAndSetVideoSpeed();
    } else {
      addLog('非学习页面，跳过自动滚动功能', 'info');
    }

    // 立即执行一次检查
    checkConditions();

    // 初始化控制面板
    setTimeout(() => {
      createControlPanel();

      // 控制面板创建后，立即更新显示状态
      if (autoLearningState && autoLearningState.courseLinks && autoLearningState.courseLinks.length > 0) {
        // 更新课程数量显示
        if (controlPanel) {
          const courseCountDiv = controlPanel.querySelector('.course-count');
          if (courseCountDiv) {
            courseCountDiv.textContent = autoLearningState.courseLinks.length.toString();
          }
        }

        // 如果是学习页面，更新学习状态显示
        if (checkAutoLearningPage()) {
          const currentCourse = autoLearningState.courseLinks[autoLearningState.currentIndex];
          if (currentCourse) {
            updateLearningStatus(currentCourse.title || '未知课程', '0%', '已恢复状态');
          }
        }

        addLog(`已恢复课程数据，共 ${autoLearningState.courseLinks.length} 门课程`, 'success');
      }
    }, 1000);

    // 页面卸载时清理
    window.addEventListener('beforeunload', function () {
      observer.disconnect();
      stopAutoScroll();
    });
  });

  addLog('云学堂视频学习监控脚本已加载', 'success');
})();
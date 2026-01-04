// ==UserScript==
// @name         宝武微学苑挂机脚本
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  跳过挂机判断，自动续播，列表播放完毕自动关闭当前标签页
// @author       SpaceJJ
// @match        http://mooc.baosteel.com/*
// @icon         https://www.google.com/s2/favicons?domain=baosteel.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558466/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/558466/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("原生弹窗拦截脚本已启动");

  // 拦截 confirm 弹窗（通常用于询问 Yes/No）
  // 直接返回 true，相当于点击了“确定”
  window.confirm = function (message) {
    console.log("已自动确认 Confirm 弹窗，内容为:", message);
    return true;
  };

  // 拦截 alert 弹窗（通常用于通知）
  // 也就是什么都不做，直接让代码继续运行，相当于点击了“确定”
  window.alert = function (message) {
    console.log("已自动关闭 Alert 弹窗，内容为:", message);
    return true;
  };

  // 拦截 prompt 弹窗（通常用于输入内容）
  // 这里默认返回空字符串，如果需要特定输入需修改
  window.prompt = function (message, defaultText) {
    console.log("已自动处理 Prompt 弹窗，内容为:", message);
    return defaultText || "";
  };

  // 劫持 onbeforeunload 属性
  Object.defineProperty(window, 'onbeforeunload', {
    set: function (value) {
      console.log('[页面离开] 拦截onbeforeunload设置');
    },
    get: function () {
      return null;
    }
  });

  console.log("✅ 弹窗拦截已完成");

})();

// ==================== 配置区 ====================
const MODE_CONFIG = 'quick'; // 'full' = 完整模式（播放完毕才下一节）, 'quick' = 快速模式（播放63%即下一节）
const QUICK_MODE_THRESHOLD = 0.63; // 快速模式的播放进度要求（63%，确保保存成功）
const CHECK_INTERVAL = 2 * 60 * 1000; // 检查间隔：2分钟

// ==================== 工具函数 ====================
/**
 * 解析时间字符串为秒数
 * @param {string} timeStr - 时间字符串，格式："MM:SS" 或 "HH:MM:SS"
 * @returns {number} 总秒数
 */
function parseTimeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(p => parseInt(p, 10));
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

/**
 * 计算需要播放的时长（分钟，向上取整）
 * @param {number} totalSeconds - 总秒数
 * @returns {number} 需要播放的分钟数
 */
function calculateRequiredMinutes(totalSeconds) {
  const requiredSeconds = totalSeconds * QUICK_MODE_THRESHOLD;
  const requiredMinutes = Math.ceil(requiredSeconds / 60);
  console.log(`[快速模式] 视频总时长: ${totalSeconds}秒, 需要播放: ${requiredMinutes}分钟`);
  return requiredMinutes;
}

/**
 * 获取视频总时长
 * @returns {string|null} 时长字符串
 */
function getVideoDuration() {
  const durationElement = document.querySelector('#player_controlbar_duration');
  if (durationElement) {
    return durationElement.textContent.trim();
  }
  return null;
}

/**
 * 获取当前播放时长
 * @returns {string|null} 时长字符串
 */
function getCurrentElapsed() {
  const elapsedElement = document.querySelector('#player_controlbar_elapsed');
  if (elapsedElement) {
    return elapsedElement.textContent.trim();
  }
  return null;
}

/**
 * 从目录列表中获取下一个视频并点击
 * @returns {boolean} 是否成功找到并点击下一个视频
 */
function clickNextVideoFromDirectory() {
  const syllabusList = document.querySelector('ul.syllabus_list');
  if (!syllabusList) {
    console.warn('[目录导航] 未找到课程目录列表');
    return false;
  }

  // 获取所有视频项（排除章节标题）
  const allVideoItems = syllabusList.querySelectorAll('li.section');
  if (allVideoItems.length === 0) {
    console.warn('[目录导航] 未找到任何视频项');
    return false;
  }

  // 找到当前激活的视频项
  let currentIndex = -1;
  for (let i = 0; i < allVideoItems.length; i++) {
    if (allVideoItems[i].classList.contains('active')) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex === -1) {
    console.warn('[目录导航] 未找到当前激活的视频项');
    return false;
  }

  // 获取下一个视频项
  const nextIndex = currentIndex + 1;
  if (nextIndex >= allVideoItems.length) {
    console.log('[目录导航] 已是最后一个视频，课程列表播放完毕');
    return false;
  }

  const nextVideo = allVideoItems[nextIndex];
  const videoName = nextVideo.querySelector('.name .mr10')?.textContent || '未知';
  console.log(`[目录导航] 找到下一个视频: ${videoName}，准备点击`);
  nextVideo.click();
  return true;
}

/**
 * 点击保存按钮（弹窗已被全局劫持，会自动确认）
 * @returns {Promise<boolean>} 是否成功点击保存
 */
function clickSaveButton() {
  return new Promise((resolve) => {
    // 查找保存按钮
    const saveButtons = document.querySelectorAll('button');
    let saveButton = null;
    
    for (let btn of saveButtons) {
      if (btn.textContent.includes('保存')) {
        saveButton = btn;
        break;
      }
    }

    if (!saveButton) {
      console.warn('[保存] 未找到保存按钮');
      resolve(false);
      return;
    }

    console.log('[保存] 找到保存按钮，准备点击（弹窗会被自动确认）');
    
    // 点击保存按钮（弹窗会被全局劫持的confirm自动确认）
    saveButton.click();

    // 延迟以确保保存操作完成（增加到3秒，确保服务器处理）
    setTimeout(() => {
      console.log('[保存] 保存操作完成');
      resolve(true);
    }, 3000);
  });
}

// 自动点击下一节
(function () {
  // 定时器自动确认(每两分钟自动检测一次)
  var autoConfirm = setInterval(() => {
    // 判断是否下一节按钮
    if (document.getElementsByClassName('ant-btn ant-btn-primary ant-btn-lg')[0]) {
      // 模拟点击
      console.log("自动确认");
      document.getElementsByClassName('ant-btn ant-btn-primary ant-btn-lg')[0].click();
    }
  }, 120000)
  var pageOfVideo = 0;//检测页面是否为视频播放页面，默认为否
  var count = 0;//超时次数统计
  var isNavigating = false;//是否正在导航到下一节（防止刷新）
  
  setTimeout(function a () {
    if (!document.getElementsByTagName('video')[0]) {
      count++;
      
      // 如果正在导航，给更多时间加载，不要刷新
      const maxCount = isNavigating ? 24 : 12; // 导航时等待2分钟，正常等待1分钟
      
      if (count >= maxCount) {//超时
        if (pageOfVideo != 0 && !isNavigating) {//视频播放页且非导航状态才刷新
          console.log("超时且非导航状态，刷新页面");
          window.location.reload();//刷新
        }
        else {
          console.log("超时但在导航状态或非视频页，继续等待");
          count = 0; // 重置计数器
          isNavigating = false; // 重置导航标志
          a();//继续设置定时器
        }
      }
      else {//未超时
        console.log(`未找到视频! 尝试次数: ${count}/${maxCount} ${isNavigating ? '(导航中)' : ''}`);
        setTimeout(() => {
          console.log("重新获取视频对象");
          a();
        }, 5000);
      }
    }
    else {
      count = 0;//超时定时器归零
      isNavigating = false;//找到视频，重置导航标志
      pageOfVideo = 1;//当有视频对象时，设置为视频播放页
      var vid = document.getElementsByTagName('video')[0];
      var videoChange = setInterval(() => {
        // 判断当前视频是否切换
        if (document.getElementsByTagName('video')[0] != vid) {
          // 切换视频重新获得视频对象
          console.log("视频切换，重置定时器");
          clearInterval(videoChange);
          clearInterval(netstat);
          a();
        }
      }, 1000)
      var netstat = setInterval(() => {//每分钟检测一次
        // 判断当前视频的网络状态，如果不正常则刷新
        if (document.getElementsByTagName('video')[0].networkState != 1) {
          // 切换视频重新获得视频对象
          console.log("视频播放网络异常");
          window.location.reload();//刷新
        }
      }, 60000)
      console.log(`[模式: ${MODE_CONFIG}] 视频正常播放，定时启动`);
      
      // ==================== 快速模式逻辑 ====================
      var progressCheckInterval = null; // 快速模式的进度检查定时器
      var requiredMinutes = 0; // 快速模式需要播放的分钟数
      var hasReachedThreshold = false; // 是否已达到阈值（防止重复触发）

      if (MODE_CONFIG === 'quick') {
        // 快速模式：获取视频时长并计算60%阈值
        // 使用轮询等待时长元素加载（视频切换后可能需要时间）
        let retryCount = 0;
        const maxRetries = 10;
        
        const tryGetDuration = () => {
          const durationStr = getVideoDuration();
          
          if (durationStr && durationStr !== '00:00') {
            // 成功获取时长
            const totalSeconds = parseTimeToSeconds(durationStr);
            requiredMinutes = calculateRequiredMinutes(totalSeconds);
            
            console.log(`[快速模式] 成功获取视频时长: ${durationStr}`);
            
            // 捕获当前视频的 requiredMinutes 值（防止视频切换时被覆盖）
            const currentVideoRequiredMinutes = requiredMinutes;
            
            // ==================== 定期保存逻辑（防止30分钟超时） ====================
            const SAVE_INTERVAL_MINUTES = 25; // 每25分钟保存一次
            const savedAtMinutes = new Set(); // 记录已保存的时间点
            
            // 计算需要保存的时间点（25, 50, 75...）
            const savePoints = [];
            if (totalSeconds > 30 * 60) { // 视频超过30分钟
              for (let i = SAVE_INTERVAL_MINUTES; i < totalSeconds / 60; i += SAVE_INTERVAL_MINUTES) {
                savePoints.push(i);
              }
              console.log(`[定期保存] 视频超过30分钟，将在以下时间点保存: ${savePoints.join(', ')}分钟`);
            }
            
            // 每2分钟检查一次播放进度
            progressCheckInterval = setInterval(() => {
              if (hasReachedThreshold) return;

              const elapsedStr = getCurrentElapsed();
              if (!elapsedStr) {
                console.warn('[快速模式] 无法获取当前播放时长');
                return;
              }

              const elapsedSeconds = parseTimeToSeconds(elapsedStr);
              const elapsedMinutes = Math.ceil(elapsedSeconds / 60);

              console.log(`[快速模式] 当前播放: ${elapsedMinutes}分钟 / 需要: ${currentVideoRequiredMinutes}分钟`);

              // 检查是否需要定期保存
              for (const savePoint of savePoints) {
                if (elapsedMinutes >= savePoint && !savedAtMinutes.has(savePoint)) {
                  savedAtMinutes.add(savePoint);
                  console.log(`[定期保存] 已播放${savePoint}分钟，执行定期保存`);
                  clickSaveButton();
                  break; // 每次只保存一个时间点
                }
              }

              if (elapsedMinutes >= currentVideoRequiredMinutes) {
                console.log('[快速模式] 已达到63%播放时长，准备保存并跳转下一节');
                hasReachedThreshold = true;
                
                // 清除所有定时器
                clearInterval(videoChange);
                clearInterval(netstat);
                clearInterval(progressCheckInterval);

                // 先点击保存，然后跳转下一节
                setTimeout(async () => {
                  // 点击保存按钮
                  console.log('[快速模式] 开始保存当前进度...');
                  await clickSaveButton();
                  
                  // 保存完成后，等待20秒确保服务器处理完成，再跳转下一节
                  console.log('[快速模式] 保存完成，等待20秒后跳转下一节...');
                  setTimeout(() => {
                    isNavigating = true; // 设置导航标志，防止刷新
                    console.log('[快速模式] 设置导航标志，准备跳转下一节');
                    
                    const hasNext = clickNextVideoFromDirectory();
                    if (!hasNext) {
                      console.log('[快速模式] 课程列表全部完成，10秒后关闭页面');
                      isNavigating = false;
                      setTimeout(() => {
                        window.close();
                      }, 10000);
                    } else {
                      setTimeout(() => {
                        a(); // 重新初始化
                      }, 5000);
                    }
                  }, 20000); // 改为20秒
                }, 2000);
              }
            }, CHECK_INTERVAL);
          } else {
            // 未获取到时长，重试
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(`[快速模式] 等待视频时长加载... (${retryCount}/${maxRetries})`);
              setTimeout(tryGetDuration, 500);
            } else {
              console.warn('[快速模式] 无法获取视频总时长，将使用完整模式');
            }
          }
        };
        
        // 延迟500ms后开始尝试获取时长
        setTimeout(tryGetDuration, 500);
      }

      // ==================== 完整模式逻辑（保留原有功能） ====================
      vid.addEventListener('ended', function () {
        // 快速模式下如果已经跳转，则忽略ended事件
        if (MODE_CONFIG === 'quick' && hasReachedThreshold) {
          console.log('[快速模式] 已提前跳转，忽略ended事件');
          return;
        }

        console.log(`[${MODE_CONFIG === 'full' ? '完整模式' : '快速模式'}] 播放完毕`);
        
        // 清除定时器
        clearInterval(videoChange);
        clearInterval(netstat);
        if (progressCheckInterval) {
          clearInterval(progressCheckInterval);
        }

        // 延迟点击下一节
        setTimeout(() => {
          if (document.getElementsByClassName('go-survey')[0]) {
            // 延迟执行关闭脚本，否则关闭太快被视为未完成当前视频的学习
            setTimeout(() => {
              window.close();
            }, 10000);
          }
          else {
            if (MODE_CONFIG === 'quick') {
              // 快速模式：从目录导航
              const hasNext = clickNextVideoFromDirectory();
              if (!hasNext) {
                console.log('[快速模式] 课程列表全部完成，10秒后关闭页面');
                setTimeout(() => {
                  window.close();
                }, 10000);
              } else {
                setTimeout(() => {
                  a();
                }, 5000);
              }
            } else {
              // 完整模式：使用原有的go-next按钮
              document.getElementsByClassName('go-next')[3].click();
              console.log('[完整模式] 点击下一节');
              setTimeout(() => {
                a();
              }, 5000);
            }
          }
        }, 2000);
      });
    }
  }, 3000);
})();

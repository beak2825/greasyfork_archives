// ==UserScript==
// @name         战舰世界注册登录领取
// @namespace    https://github.com/qianjiachun
// @version      2025.12.02.01
// @description  战舰世界注册登录领取全自动
// @author       小淳
// @match			*://i.360.cn/reg*
// @match			*://i.360.cn
// @match			*://wbox.wows.360.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      f.m.suning.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557187/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E6%B3%A8%E5%86%8C%E7%99%BB%E5%BD%95%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/557187/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C%E6%B3%A8%E5%86%8C%E7%99%BB%E5%BD%95%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

"use strict";

let useBeijingTime = true; // 是否使用北京时间
let startTime = "2025-12-01 09:21:50:345"; // 启动时间（格式：YYYY-MM-DD HH:mm:ss:SSS）
let activityUrl = "https://wbox.wows.360.cn/activity9200927188729131/takeit?actType=101&day="; // 活动URL
let refreshInterval = 200; // 刷新间隔
let clickTimerCancel = null; // 点击定时器的取消函数

// 将日期字符串（"2025-12-01 09:21:50:345"）转换为时间戳
function parseDateTimeString(dateTimeStr) {
  // 格式：YYYY-MM-DD HH:mm:ss:SSS（支持1-2位数字的月份和日期）
  const match = dateTimeStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2}):(\d{1,3})$/);
  if (!match) {
    throw new Error(`日期格式错误: ${dateTimeStr}`);
  }
  
  const [, year, month, day, hour, minute, second, millisecond] = match;
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1, // 月份从0开始
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second),
    parseInt(millisecond)
  );
  
  return date.getTime();
}

// 将时间戳转换为日期字符串（"2025-12-01 09:21:50:345"）
function formatDateTimeString(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  
  // 格式：YYYY-MM-DD HH:mm:ss:SSS
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}:${String(millisecond).padStart(3, '0')}`;
}

// 获取北京时间（不受useBeijingTime配置影响）
// 返回 { time: 时间戳, requestDuration: 请求耗时（毫秒） }
function getBeijingTime() {
  return new Promise((resolve, reject) => {
    const requestStartTime = new Date().getTime(); // 记录请求开始时间
    
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://f.m.suning.com/api/ct.do",
      onload: function (response) {
        const requestEndTime = new Date().getTime(); // 记录请求结束时间
        const requestDuration = requestEndTime - requestStartTime; // 计算请求耗时
        
        try {
          const data = JSON.parse(response.responseText);
          if (data.code === "1" && data.currentTime) {
            resolve({ time: data.currentTime, requestDuration: requestDuration });
          } else {
            resolve({ time: new Date().getTime(), requestDuration: requestDuration });
          }
        } catch (error) {
          resolve({ time: new Date().getTime(), requestDuration: requestDuration });
        }
      },
      onerror: function (error) {
        const requestEndTime = new Date().getTime(); // 记录请求结束时间
        const requestDuration = requestEndTime - requestStartTime; // 计算请求耗时
        resolve({ time: new Date().getTime(), requestDuration: requestDuration });
      }
    });
  });
}

// 获取当前时间（根据useBeijingTime判断）
function getCurrentTime() {
  return new Promise((resolve, reject) => {
    if (useBeijingTime) {
      // 获取北京时间
      getBeijingTime().then(result => {
        // 为了保持兼容性，只返回时间戳
        resolve(result.time);
      });
    } else {
      // 使用本地时间
      resolve(new Date().getTime());
    }
  });
}

// 下载文本文件
function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 精确单次延迟执行函数（基于 performance.now()）
// targetTimestamp: 目标时间戳（Date.now() 格式）
// currentTimestamp: 当前时间戳（Date.now() 格式），用于时间同步
// callback: 到达目标时间时执行的回调函数
// 返回取消函数
function accurateTimeout(targetTimestamp, currentTimestamp, callback) {
  // 记录开始时的 performance.now()，用于时间同步
  const startPerformanceTime = performance.now();
  
  // 计算目标时间相对于当前时间的差值（毫秒）
  const targetDelay = targetTimestamp - currentTimestamp;
  
  if (targetDelay <= 0) {
    // 目标时间已过，立即执行
    callback();
    return function cancel() {}; // 返回空的取消函数
  }
  
  // 计算目标 performance.now() 值
  const targetPerformanceTime = startPerformanceTime + targetDelay;
  
  let timeoutId = null;
  let animationFrameId = null;
  let cancelled = false;
  
  function tick() {
    if (cancelled) return;
    
    const now = performance.now();
    const remainingTime = targetPerformanceTime - now;
    
    if (remainingTime <= 0) {
      // 到达或超过目标时间，执行回调
      callback();
      return;
    }
    
    // 根据剩余时间选择不同的检查频率
    if (remainingTime < 16) {
      // 剩余时间很短（小于一帧），使用 setTimeout 进行更频繁的检查（1ms 间隔）
      timeoutId = setTimeout(tick, 1);
    } else {
      // 剩余时间较长，使用 requestAnimationFrame（约 16ms 一次）
      animationFrameId = requestAnimationFrame(tick);
    }
  }
  
  // 开始检查
  tick();
  
  // 返回取消函数
  return function cancel() {
    cancelled = true;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
}

// 启动点击定时器
async function startClickTimer() {
  // 取消旧的定时器（如果存在）
  if (clickTimerCancel) {
    clickTimerCancel();
    clickTimerCancel = null;
  }

  // 获取当前时间
  const currentTime = await getCurrentTime();

  // 将startTime字符串转换为时间戳
  let startTimeTimestamp;
  try {
    startTimeTimestamp = parseDateTimeString(startTime);
  } catch (error) {
    return;
  }

  // 计算延迟时间
  const delay = startTimeTimestamp - currentTime;

  if (delay > 0) {
    // 使用精确定时器替代 setTimeout（传入当前时间以确保时间基准一致）
    clickTimerCancel = accurateTimeout(startTimeTimestamp, currentTime, () => {
      clickTimerCancel = null; // 执行后清空引用
      clickRegister();
    });
  } else {
    // 目标时间已过，立即执行
    clickRegister();
  }
}

async function clickRegister() {
  const btn = document.querySelector(".quc-button");
  if (btn) {
    // 获取本地时间
    const localTime = new Date().getTime();
    const formattedTimeLocal = formatDateTimeString(localTime);
    
    // 获取北京时间（不受useBeijingTime配置影响）
    const beijingTimeResult = await getBeijingTime();
    // 减去请求耗时，得到更准确的点击时间
    const beijingTime = beijingTimeResult.time - beijingTimeResult.requestDuration;
    const formattedTimeBeijing = formatDateTimeString(beijingTime);
    
    // 生成txt文件内容并下载
    const txtContent = `点击注册时间记录\n\n本地时间: ${formattedTimeLocal}\n北京时间: ${formattedTimeBeijing}\n请求耗时: ${beijingTimeResult.requestDuration}ms`;
    const filename = `点击注册时间_${formattedTimeBeijing.replace(/[: ]/g, '-').replace(/--/g, '-')}.txt`;
    downloadTextFile(txtContent, filename);
    
    btn.click();
  }
}

async function main() {
  const url = window.location.href;

  if (url.includes("i.360.cn/reg")) {
    // 处理注册页面
    await startClickTimer();
  } else if (url.includes("i.360.cn") && !url.includes("i.360.cn/reg")) {
    // 处理i.360.cn页面（非注册页面）
    // 跳转活动URL
    if (activityUrl) {
      GM_openInTab(activityUrl, { active: true });
    }
  } else if (url.includes("wbox.wows.360.cn")) {
    // 处理活动页面 - 根据配置的间隔时间刷新
    setInterval(() => {
      window.location.reload();
    }, refreshInterval);
  }
}

(function () {
  main();
})();

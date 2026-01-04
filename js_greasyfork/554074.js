// ==UserScript==
// @name         学习新干线
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动学习技术新干线学习中心内的网络课程列表
// @author       makabaka1234
// @match        https://learning.hzrs.hangzhou.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learning.hzrs.hangzhou.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554074/%E5%AD%A6%E4%B9%A0%E6%96%B0%E5%B9%B2%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/554074/%E5%AD%A6%E4%B9%A0%E6%96%B0%E5%B9%B2%E7%BA%BF.meta.js
// ==/UserScript==

// 标签页广播对象
const chClient = new BroadcastChannel('client');
const chServer = new BroadcastChannel('server');
const params = new URLSearchParams(window.location.hash.split('?')[1]);
const courseId = params.get('courseId');

// 监听消息框出现并执行自动点击的函数
function setupAutoClickMessageBox() {
  // 查找包含特定文本的消息框
  function findAndClickMessageBox() {
    // 查找所有消息框
    const messageBoxes = document.querySelectorAll('.el-message-box');

    messageBoxes.forEach(box => {
      // 获取消息容器
      const messageElement = box.querySelector('.el-message-box__message');
      // 查找按钮容器
      const buttonContainer = box.querySelector('.el-message-box__btns');
      if (!messageElement) return;
      if (!buttonContainer) return;

      // 获取消息内容
      const messageText = messageElement.textContent || messageElement.innerText;
      // 查找确定和取消按钮
      const confirmButton = buttonContainer.querySelector('.el-button--primary');
      const cancelButton = buttonContainer.querySelector('.el-button:not(.el-button--primary)');

      // 根据文本内容决定点击哪个按钮
      if (messageText.includes('已达到')) {
        if (cancelButton) {
          console.log('检测到"已达到"关键词，点击取消按钮');
          cancelButton.click();
        }
      } else if (messageText.includes('2分钟')) {
        if (confirmButton) {
          console.log('检测到"2分钟"关键词，点击确定按钮');
          chServer.postMessage(`完成课程:${courseId}`);
          confirmButton.click();
        }
      } else if (messageText.includes('是否继续学习') || messageText.includes('同时播放')) {
        console.log('检测到弹窗，点击确定按钮');
        confirmButton.click();
      } else {
        console.log('未匹配到关键词，默认确定');
        confirmButton.click();
      }
    });
  }

  // 初始检查（适用于页面加载时已存在的消息框）
  findAndClickMessageBox();

  // 使用MutationObserver监听DOM变化，处理动态弹出的消息框
  const observer = new MutationObserver(function (mutations) {
    let shouldCheck = false;

    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function (node) {
          // 检查新增的节点或其子节点是否包含消息框
          if (node.nodeType === 1 && (
            node.classList.contains('el-message-box') ||
            node.querySelector('.el-message-box')
          )) {
            shouldCheck = true;
          }
        });
      }
    });

    if (shouldCheck) {
      // 稍作延迟以确保消息框完全渲染
      setTimeout(findAndClickMessageBox, 100);
    }
  });

  // 开始观察DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('消息框自动点击监听器已启动');
}

/**
 * 创建一个用于管理 beforeunload 事件监听器的管理器。
 *
 * 该函数通过重写 window.addEventListener 和 window.removeEventListener，
 * 拦截并记录所有 beforeunload 类型的事件监听器，以便后续统一管理。
 * 返回的对象提供了移除所有已记录监听器和恢复原始方法的功能。
 *
 * @returns {Object} 包含以下方法的对象：
 *   - removeAllBeforeunloadListeners: 移除所有已记录的 beforeunload 监听器
 *   - restore: 恢复原始的 addEventListener 和 removeEventListener 方法
 */
function createBeforeunloadListenerManager() {
  const originalAddEventListener = window.addEventListener;
  // 重写 addEventListener，记录 beforeunload 监听器
  window.addEventListener = function (type, listener, options) {
    if (type === 'beforeunload') {
      console.log("忽略beforeunload监听事件");
      return;
    }
    // 调用原始方法
    return originalAddEventListener.call(this, type, listener, options);
  };
}




// 课程学习页面
if(window.location.hash.indexOf('#/class') == 0) {
  // 使用管理器
  createBeforeunloadListenerManager();

  // 页面加载完成后执行按钮监听
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoClickMessageBox);
  } else {
    setupAutoClickMessageBox();
  }
  // 客户端通信逻辑
  chClient.addEventListener('message', function(event) {
    console.log('客户端收到消息：', event.data);
    chServer.postMessage(`当前客户端:${courseId}`);
  });
  chServer.postMessage(`当前客户端:${courseId}`);
}
// 课程列表页面
else if(window.location.hash.indexOf('#/learn') == 0) {
  async function getCourseList() {
    return (await(await fetch("https://learning.hzrs.hangzhou.gov.cn/api/index/Course/index", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ limit: 100, page: 1 })
    })).json()).data.data;
  };
  let resp = null;

  chClient.postMessage(`服务端请求查询当前课程`);
  let clientCount = 0;
  let requestClient = async () => {
    resp = await getCourseList();
    if(!resp || !resp.length)
      return;
    clientCount = 0;
    chClient.postMessage(`服务端请求查询当前课程`);
    // 发出请求一秒后判断客户端数量
    setTimeout(() => {
      switch(clientCount) {
        case 0:
          // 没有客户端，需要新标签页打开课程
          console.log(`当前没有在学习课程，打开课程${resp[0].courseid}${resp[0].coursename}`);
          window.open(`https://learning.hzrs.hangzhou.gov.cn/#/class?courseId=${resp[0].courseid}&coursetitle=${resp[0].coursename}`, '_blank');
          break;
        case 1:
          // 只有一个客户端，什么都不用做
          console.log(`只有一个客户端，正常`);
          break;
        default:
          // 超过1个客户端不正常
          chClient.postMessage(`关闭当前课程`);
          break;
      }
    }, 1000);
  };
  // 立即调用一次
  requestClient();
  setInterval(requestClient, 30000);

  /*
    服务端的逻辑：
    1. 判断是否有课程正在学习
    1.1 如果没有则打开当前列表中第一个课程
    1.2 如果有则定时查询课程进度，如果进度达到100%则刷新页面
  */
  chServer.addEventListener('message', function(event) {
    clientCount ++;
    console.log('服务端收到消息：', event.data);
    let paramList = event.data.split(":");
    let match = false;
    if(paramList[0] != '完成课程') {
      resp.forEach(item => {
        if(item.courseid == paramList[1]) {
          match = item.validstudytime != item.coursetimes;
          const learnTime = parseFloat(item.validstudytime);
          const totalTime = parseFloat(item.coursetimes);
          console.log(`当前学习课程${item.coursename} (${(100 * learnTime / totalTime).toFixed(0)}%):`, item);
        }
      });
    }
    if(!match) {
      // 刷新当前页面
      window.location.reload();
    }
  });
}
// ==UserScript==
// @name         TikTok Live Chat Comment Getter
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  Retrieve TikTok live chat comments and output them to the console.
// @author       Johnhan Liu
// @match        https://www.tiktok.com/*
// @include      https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      emjsm5u6.fn.bytedance.net
// @connect      *.fn.bytedance.net
// @downloadURL https://update.greasyfork.org/scripts/564084/TikTok%20Live%20Chat%20Comment%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/564084/TikTok%20Live%20Chat%20Comment%20Getter.meta.js
// ==/UserScript==

// doc https://www.tampermonkey.net/documentation.php
(function () {
  "use strict";

  console.log("🚀 TikTok 直播评论获取脚本开始加载...");
  console.log("📍 当前页面:", window.location.href);

  // 使用 Set 存储已见过的评论（使用评论文本作为唯一标识）
  let seenComments = new Set();
  let checkInterval = null;

  // API 配置
  const API_URL = "http://localhost:8080/api/hbx/tiktok-comments/interact-push";

  // 从 URL 中提取 room_id（如果可能）
  function extractRoomId() {
    try {
      // 尝试从 URL 路径中提取房间ID
      const urlMatch = window.location.pathname.match(/live\/(\d+)/);
      if (urlMatch) {
        return parseInt(urlMatch[1], 10);
      }
      // 如果无法提取，返回默认值 1
      return 1;
    } catch (e) {
      return 1;
    }
  }

  // 发送评论到 API（使用 GM_xmlhttpRequest 绕过 CSP）
  function sendCommentToAPI(commentData) {
    return new Promise((resolve, reject) => {
      const payload = {
        kind: 0,
        room_id: extractRoomId(),
        content: commentData.text,
        reply_kind: 1,
        user_name: commentData.userName,
        user_id: commentData.userId,
        comments: [commentData.text],
      };

      // 提取 URL 的域名
      let urlDomain;
      try {
        const urlObj = new URL(API_URL);
        urlDomain = urlObj.hostname;
        console.log("📤 准备发送请求到 API:", {
          url: API_URL,
          domain: urlDomain,
          method: "PUT",
          payload: payload,
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.error("❌ URL 解析失败:", e);
        resolve({
          success: false,
          error: "Invalid URL: " + API_URL,
        });
        return;
      }

      // 检查 GM_xmlhttpRequest 是否可用
      if (typeof GM_xmlhttpRequest === "undefined") {
        console.error("❌ GM_xmlhttpRequest 不可用！请检查 @grant 指令");
        resolve({
          success: false,
          error: "GM_xmlhttpRequest is not available",
        });
        return;
      }

      console.log("✅ GM_xmlhttpRequest 可用");
      console.log(
        "🔗 请求域名:",
        urlDomain,
        "(请确保该域名在 @connect 列表中)",
      );

      // 设置超时处理（30秒）
      const timeoutMs = 30000;
      let timeoutId;
      let statusCheckInterval;

      // 定期检查请求状态
      let checkCount = 0;
      statusCheckInterval = setInterval(() => {
        checkCount++;
        console.log(`🔍 ${checkCount}秒后检查：`, {
          timeoutRemaining: timeoutMs - checkCount * 1000,
          callbacksTriggered: "等待中...",
        });

        // 每5秒提醒一次
        if (checkCount % 5 === 0) {
          console.warn(
            `⚠️ 请求已发送 ${checkCount} 秒，但尚未收到响应。请检查：`,
            "\n1. 浏览器 Network 标签页是否有请求记录",
            "\n2. 服务器是否正在运行",
            "\n3. 是否有网络防火墙阻止",
          );
        }

        // 如果超过超时时间，清除检查
        if (checkCount * 1000 >= timeoutMs) {
          clearInterval(statusCheckInterval);
        }
      }, 1000);

      timeoutId = setTimeout(() => {
        clearInterval(statusCheckInterval);
        console.warn(`⏱️ 请求超时（${timeoutMs / 1000}秒）`);
        resolve({
          success: false,
          error: `Request timeout after ${timeoutMs / 1000} seconds`,
        });
      }, timeoutMs);

      console.log(`⏰ 设置超时定时器: ${timeoutMs}ms`);

      try {
        console.log("🔵 调用 GM_xmlhttpRequest...");
        const requestId = GM_xmlhttpRequest({
          method: "PUT",
          url: API_URL,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(payload),
          onload: function (response) {
            clearTimeout(timeoutId);
            clearInterval(statusCheckInterval);
            console.log("📥 onload 回调被触发:", {
              status: response.status,
              statusText: response.statusText,
              readyState: response.readyState,
              responseHeaders: response.responseHeaders,
              responseText: response.responseText?.substring(0, 200),
            });

            if (response.status >= 200 && response.status < 300) {
              try {
                const result = JSON.parse(response.responseText);
                console.log(`✅ 评论已发送到 API:`, commentData.text);
                resolve({
                  success: true,
                  data: result,
                  status: response.status,
                });
              } catch (e) {
                console.log(`✅ 评论已发送到 API:`, commentData.text);
                resolve({
                  success: true,
                  data: response.responseText,
                  status: response.status,
                });
              }
            } else {
              console.error(
                `❌ API 请求失败 (${response.status}):`,
                response.responseText,
              );
              resolve({
                success: false,
                error: response.responseText,
                status: response.status,
              });
            }
          },
          onerror: function (error) {
            clearTimeout(timeoutId);
            clearInterval(statusCheckInterval);
            console.error("❌ onerror 回调被触发:", {
              error: error,
              message: error.message,
              details: JSON.stringify(error, null, 2),
            });
            resolve({
              success: false,
              error: error.message || "Network error",
            });
          },
          ontimeout: function () {
            clearTimeout(timeoutId);
            clearInterval(statusCheckInterval);
            console.error("⏱️ ontimeout 回调被触发");
            resolve({
              success: false,
              error: "Request timeout",
            });
          },
          onreadystatechange: function (response) {
            console.log("🔄 onreadystatechange:", {
              readyState: response.readyState,
              status: response.status,
            });
          },
        });

        console.log(
          "📋 GM_xmlhttpRequest 调用完成，返回 requestId:",
          requestId,
        );

        // 检查返回的对象
        if (requestId && typeof requestId === "object") {
          console.log("📦 requestId 对象详情:", {
            hasAbort: typeof requestId.abort === "function",
            keys: Object.keys(requestId),
          });
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("❌ GM_xmlhttpRequest 调用异常:", error);
        resolve({
          success: false,
          error: error.message || "Failed to initiate request",
        });
      }
    });
  }

  // 获取评论内容的函数
  function getLiveChatComments() {
    try {
      // 使用 querySelectorAll 获取所有评论元素
      const commentElements = document.querySelectorAll(
        ".text-UIText1 > div:nth-child(2)",
      );

      // 过滤掉父元素带有 data-e2e="enter-message" 的元素（排除输入框）
      const filteredElements = Array.from(commentElements).filter((item) => {
        const parent = item.closest(".text-UIText1");
        return parent && parent.getAttribute("data-e2e") !== "enter-message";
      });

      // 提取评论信息（包括文本、用户名等）
      const comments = filteredElements.map((item) => {
        const parent = item.closest(".text-UIText1");
        const commentText = item.innerText.split("\n").at(-1);

        // 尝试提取用户名（通常在父元素的第一个子元素或兄弟元素中）
        let userName = "unknown";
        let userId = "unknown";

        try {
          // 尝试从父元素中查找用户名
          const nameElement =
            parent?.querySelector('[data-e2e="comment-username"]') ||
            parent?.querySelector('span[class*="username"]') ||
            parent?.querySelector('a[href*="/@"]');

          if (nameElement) {
            userName =
              nameElement.innerText?.trim() ||
              nameElement.textContent?.trim() ||
              "unknown";
            // 尝试从链接中提取用户ID
            const href = nameElement.getAttribute("href");
            if (href) {
              const match = href.match(/@([^/?]+)/);
              if (match) userId = match[1];
            }
          }
        } catch (e) {
          // 忽略提取错误
        }

        return {
          text: commentText,
          userName: userName,
          userId: userId,
          element: item, // 保留元素引用以便后续使用
        };
      });

      return comments;
    } catch (error) {
      console.error("获取评论时出错:", error);
      return [];
    }
  }

  async function checkForNewComments() {
    const comments = getLiveChatComments();

    // 提取评论文本用于比较
    const commentTexts = comments.map((c) => c.text);

    // 使用 Set 差集找出新评论：当前评论 - 已见过的评论
    const newComments = comments.filter(
      (comment) => !seenComments.has(comment.text),
    );

    // 如果有新评论，输出并发送到 API
    if (newComments.length > 0) {
      console.log(
        `发现 ${newComments.length} 条新评论:`,
        newComments.map((c) => c.text),
      );

      // 将新评论发送到 API
      for (const comment of newComments) {
        await sendCommentToAPI(comment);
        // 添加小延迟避免请求过快
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 将新评论添加到已见过的 Set 中
      newComments.forEach((comment) => seenComments.add(comment.text));
    }

    // 更新已见过的评论 Set（处理评论被删除的情况）
    seenComments = new Set(commentTexts);
  }

  // 等待评论容器出现的函数
  function waitForCommentsContainer(maxAttempts = 30, interval = 1000) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkContainer = () => {
        attempts++;
        const commentElements = document.querySelectorAll(
          ".text-UIText1 > div:nth-child(2)",
        );

        // 过滤掉父元素带有 data-e2e="enter-message" 的元素
        const filteredElements = Array.from(commentElements).filter((item) => {
          const parent = item.closest(".text-UIText1");
          return parent && parent.getAttribute("data-e2e") !== "enter-message";
        });

        if (filteredElements.length > 0) {
          console.log(
            `✅ 找到评论容器，共 ${filteredElements.length} 个评论元素`,
          );
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          console.warn(
            `⚠️ 等待 ${maxAttempts} 次后仍未找到评论容器，可能不在直播页面`,
          );
          resolve(false);
          return;
        }

        setTimeout(checkContainer, interval);
      };

      checkContainer();
    });
  }

  // 初始化函数
  async function init() {
    console.log("⏳ 等待页面加载完成...");

    // 等待评论容器出现
    const found = await waitForCommentsContainer(30, 1000);

    if (found) {
      // 首次获取评论并初始化 Set
      checkForNewComments();

      // 开始定时检查新评论
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      checkInterval = setInterval(checkForNewComments, 2000);
      console.log("✅ 开始监听新评论，每2秒检查一次");
    } else {
      console.log(
        "💡 未找到评论容器，可能不在直播页面。可以在控制台手动调用 getLiveChatComments() 试试",
      );
    }
  }

  // 页面加载完成后开始初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }

  // 测试 GM_xmlhttpRequest 是否正常工作
  function testGM_xmlhttpRequest() {
    console.log("🧪 测试 GM_xmlhttpRequest...");
    if (typeof GM_xmlhttpRequest === "undefined") {
      console.error("❌ GM_xmlhttpRequest 不可用！");
      return;
    }

    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://httpbin.org/get",
        onload: function (response) {
          console.log("✅ 测试请求成功:", response.status);
        },
        onerror: function (error) {
          console.error("❌ 测试请求失败:", error);
        },
        ontimeout: function () {
          console.error("⏱️ 测试请求超时");
        },
      });
      console.log("✅ 测试请求已发送");
    } catch (error) {
      console.error("❌ 测试请求异常:", error);
    }
  }

  // 导出函数供手动调用
  window.getLiveChatComments = getLiveChatComments;
  window.sendCommentToAPI = sendCommentToAPI;
  window.testGM_xmlhttpRequest = testGM_xmlhttpRequest;

  console.log("✅ TikTok 直播评论获取脚本已加载！");
  console.log("💡 提示：可以在控制台输入 getLiveChatComments() 手动获取评论");
  console.log("📡 新评论将自动发送到 API:", API_URL);
  console.log("🧪 可以在控制台输入 testGM_xmlhttpRequest() 测试网络请求");

  // 延迟测试，确保页面加载完成
  setTimeout(() => {
    console.log("🔍 检查 GM_xmlhttpRequest 权限...");
    if (typeof GM_xmlhttpRequest === "undefined") {
      console.error(
        "❌ GM_xmlhttpRequest 不可用！请检查：",
        "\n1. 脚本头部是否有 @grant GM_xmlhttpRequest",
        "\n2. Tampermonkey 设置中是否允许了该域名",
        "\n3. 尝试重新安装脚本",
      );
    } else {
      console.log("✅ GM_xmlhttpRequest 可用");
    }
  }, 2000);
})();

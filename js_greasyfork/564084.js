// ==UserScript==
// @name         TikTok Live Chat Comment Getter
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Retrieve TikTok live chat comments and output them to the console.
// @author       Johnhan Liu
// @match        https://www.tiktok.com/*
// @include      https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564084/TikTok%20Live%20Chat%20Comment%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/564084/TikTok%20Live%20Chat%20Comment%20Getter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("🚀 TikTok 直播评论获取脚本开始加载...");
  console.log("📍 当前页面:", window.location.href);

  // 使用 Set 存储已见过的评论
  let seenComments = new Set();
  let checkInterval = null;

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

      // 提取评论文本内容
      const comments = filteredElements.map((item) =>
        item.innerText.split("\n").at(-1),
      );

      return comments;
    } catch (error) {
      console.error("获取评论时出错:", error);
      return [];
    }
  }

  function checkForNewComments() {
    const comments = getLiveChatComments();

    // 使用 Set 差集找出新评论：当前评论 - 已见过的评论
    const newComments = comments.filter(
      (comment) => !seenComments.has(comment),
    );

    // 如果有新评论，输出新增的评论
    if (newComments.length > 0) {
      console.log(`发现 ${newComments.length} 条新评论:`, newComments);

      // TODO 这里需要调用直播的 OpenAPI，将新评论发送到服务器

      // 将新评论添加到已见过的 Set 中
      newComments.forEach((comment) => seenComments.add(comment));
    }

    // 更新已见过的评论 Set（处理评论被删除的情况）
    seenComments = new Set(comments);
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

  // 也可以手动调用：在控制台输入 getLiveChatComments() 即可获取当前评论
  window.getLiveChatComments = getLiveChatComments;

  console.log("✅ TikTok 直播评论获取脚本已加载！");
  console.log("💡 提示：可以在控制台输入 getLiveChatComments() 手动获取评论");
})();

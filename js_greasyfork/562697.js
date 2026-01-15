// ==UserScript==
// @name         掘金自动签到助手
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  掘金自动签到
// @author       raoju
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_openInTab
// @run-at       document-idle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562697/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562697/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 如果签到年月日和今天一样,不需要在签到,直接返回
  const signTime = GM_getValue("signTime", "");
  const today = new Date().toLocaleDateString();
  if (signTime === today) {
    console.log("今日已签到，跳过");
    return;
  }

  const targetPage = "https://juejin.cn/user/center/signin";
  const AUTO_SIGN_PARAM = "auto_sign=true";

  // 关闭页面的函数
  function closePage() {
    // 检查是否是脚本打开的页面（通过 URL 参数判断）
    const isAutoOpened = location.href.includes(AUTO_SIGN_PARAM) ||
                         sessionStorage.getItem('autoSignOpened') === 'true';

    if (!isAutoOpened) {
      console.log("页面不是由脚本打开的，不关闭");
      return;
    }

    console.log("尝试关闭页面");
    // 尝试关闭页面
    setTimeout(() => {
      try {
        window.close();
        // 如果关闭失败，尝试其他方法
        setTimeout(() => {
          if (!document.hidden) {
            // 如果页面还在，尝试通过 history 返回
            if (window.history.length > 1) {
              window.history.back();
            }
          }
        }, 1000);
      } catch (e) {
        console.log("关闭页面失败（浏览器安全限制）:", e);
      }
    }, 500);
  }

  // --- 1. 签到页面逻辑 ---
  function findSignButton() {
    // 先尝试旧的选择器
    let signBtn = document.querySelector('.code-calender button.btn');

    // 如果找不到，尝试通过文本内容查找所有按钮
    if (!signBtn) {
      const allButtons = Array.from(document.querySelectorAll('button'));
      signBtn = allButtons.find(btn => {
        const text = btn.textContent || btn.innerText || '';
        return text.includes('立即签到') || text.includes('今日已签到');
      });
    }

    return signBtn;
  }

  function handleSign() {
    // 检查是否在签到页面
    if (!location.href.includes(targetPage)) {
      return;
    }

    const signBtn = findSignButton();
    if (!signBtn) {
      console.log("未找到签到按钮，等待中...");
      return false;
    }

    const buttonText = signBtn.textContent || signBtn.innerText || '';
    console.log("找到签到按钮，文本内容:", buttonText);

    if (buttonText.includes("立即签到")) {
      console.log("未签到，准备点击");
      // 点击签到按钮
      setTimeout(() => {
        signBtn.click();
        console.log("已点击签到按钮");

        // 等待签到完成后再保存时间
        setTimeout(() => {
          GM_setValue("signTime", today);
          console.log("签到成功，已保存时间:", today);
          // 关闭页面
          closePage();
        }, 3000);
      }, 2000);
      return true;
    } else if (buttonText.includes("今日已签到")) {
      console.log("今日已签到");
      setTimeout(() => {
        GM_setValue("signTime", today);
        // 关闭页面
        closePage();
      }, 2000);
      return true;
    }

    return false;
  }

  // 使用 MutationObserver 监听 DOM 变化，更可靠
  function observeAndSign() {
    if (!location.href.includes(targetPage)) {
      return;
    }

    // 先尝试一次
    if (handleSign()) {
      return;
    }

    // 如果没找到，使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations, obs) => {
      if (handleSign()) {
        obs.disconnect(); // 找到并处理后就停止观察
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 设置超时，避免无限等待
    setTimeout(() => {
      observer.disconnect();
      if (!GM_getValue("signTime", "")) {
        console.log("超时未找到签到按钮");
      }
    }, 30000); // 30秒超时
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAndSign);
  } else {
    observeAndSign();
  }

  // 也监听 load 事件（作为备用）
  unsafeWindow.addEventListener("load", () => {
    setTimeout(observeAndSign, 1000);
  });

  // --- 2. 首页逻辑 ---
  // 未签到的情况下,只有非签到页才进行后台打开签到页
  if (!location.href.includes(targetPage)) {
    // 延迟一下再打开，避免频繁打开
    setTimeout(() => {
      // 添加标记参数，标识这是脚本打开的页面
      // 使用 URL 对象来正确处理参数
      const url = new URL(targetPage);
      url.searchParams.set('auto_sign', 'true');
      GM_openInTab(url.toString(), { active: false });
      console.log("已打开签到页面:", url.toString());
    }, 1000);
  } else {
    // 如果在签到页面，检查是否是脚本打开的
    if (location.href.includes(AUTO_SIGN_PARAM)) {
      // 设置 sessionStorage 标记
      sessionStorage.setItem('autoSignOpened', 'true');
    }
  }
})();

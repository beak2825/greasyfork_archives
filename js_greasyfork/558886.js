// ==UserScript==
// @name         Discourse 一键回复（抽奖/快捷回帖）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Discourse 帖子页面添加一键按钮：linux.do 随机参与抽奖；nodeloc.com 一键回复“来啦。看看是啥”
// @author       IZSSERAFIM
// @match        https://linux.do/t/*
// @match        https://www.nodeloc.com/t/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558886/Discourse%20%E4%B8%80%E9%94%AE%E5%9B%9E%E5%A4%8D%EF%BC%88%E6%8A%BD%E5%A5%96%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%B8%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558886/Discourse%20%E4%B8%80%E9%94%AE%E5%9B%9E%E5%A4%8D%EF%BC%88%E6%8A%BD%E5%A5%96%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%B8%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LINUX_DO_CONFIG = {
    buttonId: "lottery-reply-btn",
    replyTexts: [
      "参与一下",
      "我来组成分母",
      "参与参与",
      "路过参与",
      "抽奖试试",
      "参与抽奖",
      "我来参与一下",
      "十分感谢",
      "前排参与",
      "积极参与",
      "参与陪跑",
      "重在参与",
      "前排前排",
      "感谢大佬",
      "来试一试",
      "好欸~~",
      "感谢分享",
      "增大分母",
      "必须点赞",
      "点赞点赞",
      "抽我抽我",
      "来辣来辣",
      "后排参与",
      "好运来吧",
      "支持支持",
      "拉低中奖率",
      "拉低中奖率",
      "凑个热闹",
      "凑数来了",
      "报个名！",
      "打卡参与",
      "强势参与",
      "参与+1",
      "试试手气",
      "碰碰运气",
      "求中奖！",
      "求好运！",
      "许愿中奖",
      "欧气快来",
      "分母+1",
      "陪跑选手",
      "重在掺和",
      "凑个人头",
      "中奖率破坏者",
      "专业陪跑",
      "中奖绝缘体",
      "非酋报到",
      "谢谢老板",
      "感谢金主",
      "大佬大气",
      "接好运！",
      "前排围观",
      "占个前排",
      "冲冲冲！",
      "中中中！",
      "必中必中",
      "求求了！",
      "来了来了",
      "狠狠参与了",
      "这波必中",
      "冲了冲了",
      "万一中了呢",
    ], // 可能的回复内容
    buttonText: "一键参与抽奖",
    buttonProcessingText: "参与中...",
    successMessage: "参与成功！",
    likeBeforeReply: true,
    requireConfirm: true,
    confirmPrefix: "确定要回复",
    confirmSuffix: "吗？",
    errorMessage: "参与失败，请手动操作",
    maxRetries: 3,
    buttonBgColor: "#ff6b6b",
    buttonTextColor: "white",
  };

  const NODELOC_CONFIG = {
    buttonId: "nodeloc-reply-btn",
    replyTexts: ["来啦。看看是啥"],
    buttonText: "一键回复",
    buttonProcessingText: "回复中...",
    successMessage: "回复成功！",
    likeBeforeReply: true,
    requireConfirm: false,
    confirmPrefix: "确定要回复主贴",
    confirmSuffix: "吗？",
    errorMessage: "回复失败，请手动操作",
    maxRetries: 1,
    buttonBgColor: "#4dabf7",
    buttonTextColor: "white",
    preferPostReplyButton: true,
  };

  const CONFIG = (() => {
    const { host, pathname } = window.location;
    if (host === "linux.do") return LINUX_DO_CONFIG;
    if (host === "www.nodeloc.com" && /^\/t\//.test(pathname))
      return NODELOC_CONFIG;
    return null;
  })();

  if (!CONFIG) return;

  function escapeIdForSelector(id) {
    if (window.CSS && typeof window.CSS.escape === "function")
      return window.CSS.escape(id);
    return String(id).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function pickRandom(arr) {
    const random =
      Math.random() + Date.now() + Math.random() * performance.now();
    const index = Math.floor((random % 1) * arr.length);
    return arr[index];
  }

  function pickRandomExcept(arr, exclude) {
    const filtered = arr.filter((item) => item !== exclude);
    return pickRandom(filtered.length ? filtered : arr);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function sleepRandom(min, max) {
    return sleep(Math.floor(min + Math.random() * (max - min)));
  }

  function findFirstPostElement() {
    return (
      document.querySelector('article.topic-post[data-post-number="1"]') ||
      document.querySelector("article#post_1") ||
      Array.from(document.querySelectorAll("article.topic-post"))[0] ||
      null
    );
  }

  function findReplyButton() {
    const isUsableReplyToPostButton = (btn) => {
      if (!btn) return false;
      const className = btn.className || "";
      if (!/\breply-to-post\b/.test(className)) return false;
      if (!/\bcreate\b/.test(className)) return false;
      return true;
    };

    const findFirstPostReplyToPostButton = () => {
      const firstPost = findFirstPostElement();
      if (!firstPost) return null;

      const btn =
        firstPost.querySelector("button.create.reply-to-post") ||
        firstPost.querySelector("button.reply-to-post") ||
        null;
      return isUsableReplyToPostButton(btn) ? btn : null;
    };

    const findAnyReplyToPostButton = () => {
      const btn =
        document.querySelector("button.create.reply-to-post") ||
        document.querySelector("button.reply-to-post") ||
        null;
      return isUsableReplyToPostButton(btn) ? btn : null;
    };

    return findFirstPostReplyToPostButton() || findAnyReplyToPostButton();
  }

  async function tryLikeFirstPost() {
    await waitForElement(
      [
        'article.topic-post[data-post-number="1"] button.btn-toggle-reaction-like',
        "article#post_1 button.btn-toggle-reaction-like",
        "button.btn-toggle-reaction-like",
      ].join(", "),
      1500,
    ).catch(() => null);

    const firstPost = findFirstPostElement();
    if (!firstPost) return false;

    const likeBtn =
      firstPost.querySelector(
        ".discourse-reactions-reaction-button button.btn-toggle-reaction-like",
      ) ||
      firstPost.querySelector("button.btn-toggle-reaction-like") ||
      firstPost.querySelector("button.toggle-like") ||
      null;

    if (!likeBtn) return false;

    const ariaPressed = (likeBtn.getAttribute("aria-pressed") || "").toLowerCase();
    if (ariaPressed === "true") return true;

    const iconUse = likeBtn.querySelector("use");
    const href = (iconUse?.getAttribute("href") || "").toLowerCase();

    // 只在“明显未点赞”时点击，避免误触导致取消点赞
    const looksUnliked =
      href.includes("unliked") || href.includes("d-unliked") || href.includes("far-heart");
    if (!looksUnliked) {
      return false;
    }

    likeBtn.scrollIntoView({ block: "center", inline: "center" });
    await sleepRandom(60, 180);
    likeBtn.click();
    await sleepRandom(180, 420);
    return true;
  }

  // 等待元素出现
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      let timer;
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearTimeout(timer);
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      timer = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待元素超时: ${selector}`));
      }, timeout);
    });
  }

  function findDuplicateDialog() {
    const overlay = document.querySelector(
      ".dialog-overlay[data-a11y-dialog-hide]",
    );
    const dialogBody = Array.from(
      document.querySelectorAll(".dialog-body"),
    ).find(
      (node) => node.textContent && node.textContent.includes("内容过于相似"),
    );
    const okBtn = (() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find((btn) => {
        const label = btn.querySelector(".d-button-label");
        const text = (label?.textContent || btn.textContent || "").trim();
        return text.includes("确定");
      });
    })();
    if (!overlay && !dialogBody) return null;
    return { overlay, dialogBody, okBtn };
  }

  function waitForDuplicateDialog(timeout = 2500) {
    return new Promise((resolve) => {
      const existing = findDuplicateDialog();
      if (existing) {
        resolve(existing);
        return;
      }

      let timer;
      const observer = new MutationObserver(() => {
        const found = findDuplicateDialog();
        if (found) {
          clearTimeout(timer);
          observer.disconnect();
          resolve(found);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      timer = setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  async function waitForOverlayDismiss(overlay, timeout = 2000) {
    const start = Date.now();
    while (
      overlay &&
      document.contains(overlay) &&
      Date.now() - start < timeout
    ) {
      await sleep(120);
    }
  }

  async function openReplyComposer() {
    const replyButton = findReplyButton();
    if (replyButton) {
      replyButton.click();
      await sleepRandom(300, 700);
      return true;
    }

    // Discourse 常见快捷键：r = 回复（可能受焦点/权限影响）
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "r", code: "KeyR", bubbles: true }),
    );
    await sleepRandom(250, 600);
    return Boolean(document.querySelector(".reply-area"));
  }

  async function tryReply(chosenReply) {
    // 打开回复框（如果还没打开）
    if (!document.querySelector(".reply-area")) {
      const opened = await openReplyComposer();
      if (!opened) {
        throw new Error(
          "未找到回复入口：可能未登录、帖子已关闭/归档或无回复权限",
        );
      }
    }

    const textarea = await waitForElement(".reply-area .d-editor-input", 3000);
    // 模拟逐字输入，减少机械感
    textarea.value = "";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    for (const ch of chosenReply.split("")) {
      textarea.value += ch;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      await sleepRandom(30, 120);
    }

    const submitBtn = await waitForElement(".reply-area button.create", 3000);
    await sleepRandom(250, 700);
    submitBtn.click();

    const duplicateDialog = await waitForDuplicateDialog(2500);
    if (duplicateDialog) {
      await sleepRandom(300, 800);
      if (duplicateDialog.okBtn) {
        duplicateDialog.okBtn.click();
      } else if (duplicateDialog.overlay) {
        duplicateDialog.overlay.click();
      }
      await waitForOverlayDismiss(duplicateDialog.overlay);
      return "duplicate";
    }

    return "ok";
  }

  let injecting = false;
  let retryTimer = null;
  let retryCount = 0;
  const MAX_INJECT_RETRIES = 20;

  function scheduleInjectRetry() {
    if (retryTimer) return;
    if (retryCount >= MAX_INJECT_RETRIES) return;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      retryCount += 1;
      addLotteryButton();
    }, 500);
  }

  function clearInjectRetry() {
    retryCount = 0;
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  // 添加快捷回复按钮
  async function addLotteryButton() {
    if (injecting) return;
    const existing = document.querySelector(`#${escapeIdForSelector(CONFIG.buttonId)}`);
    if (existing) return;
    injecting = true;

    try {
      const replyButton = findReplyButton();
      if (!replyButton || !replyButton.parentNode) {
        scheduleInjectRetry();
        return;
      }
      const container = replyButton.parentNode;

      // 若已存在同名按钮则不重复添加（按钮可能不在同一容器内）
      if (document.querySelector(`#${escapeIdForSelector(CONFIG.buttonId)}`)) {
        return;
      }

      clearInjectRetry();

      // 创建抽奖按钮
      const lotteryBtn = document.createElement("button");
      lotteryBtn.id = CONFIG.buttonId;
      lotteryBtn.textContent = CONFIG.buttonText;
      lotteryBtn.className =
        (replyButton ? replyButton.className : "btn btn-primary") +
        " quick-reply-btn";
      lotteryBtn.style.marginLeft = "0";
      lotteryBtn.style.backgroundColor = CONFIG.buttonBgColor;
      lotteryBtn.style.color = CONFIG.buttonTextColor;
      lotteryBtn.style.whiteSpace = "nowrap";

      // 添加点击事件
      lotteryBtn.addEventListener("click", async () => {
        const originalText = lotteryBtn.textContent;
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = CONFIG.buttonProcessingText;
        let lastReply = null;

        try {
          if (CONFIG.likeBeforeReply) {
            try {
              await tryLikeFirstPost();
            } catch (e) {
              console.warn("点赞失败（忽略，继续回复）:", e);
            }
            await sleepRandom(120, 300);
          }

          let attempt = 0;
          let state = "duplicate";

          while (attempt < CONFIG.maxRetries && state === "duplicate") {
            const chosenReply = pickRandomExcept(CONFIG.replyTexts, lastReply);
            lastReply = chosenReply;
            const confirmMessage = `${CONFIG.confirmPrefix}「${chosenReply}」${CONFIG.confirmSuffix}`;

            if (attempt === 0) {
              // 首次询问确认
              if (CONFIG.requireConfirm && !confirm(confirmMessage)) {
                return;
              }
            }

            await sleepRandom(150, 500);
            state = await tryReply(chosenReply);
            attempt += 1;
          }

          if (state === "duplicate") {
            throw new Error("多次尝试仍然重复内容");
          }

          // 显示成功消息
          setTimeout(() => {
            alert(CONFIG.successMessage);
          }, 500);
        } catch (error) {
          console.error("参与抽奖失败:", error);
          const msg =
            error && error.message
              ? `${CONFIG.errorMessage}\n\n${error.message}`
              : CONFIG.errorMessage;
          alert(msg);
        } finally {
          lotteryBtn.disabled = false;
          lotteryBtn.textContent = originalText;
        }
      });

      const wrapper = document.createElement("div");
      wrapper.className = "quick-reply-wrapper";
      wrapper.appendChild(lotteryBtn);

      // 不改动原有按钮行：让容器支持换行，并把 wrapper 追加到末尾占满一行
      container.classList.add("quick-reply-container");
      container.appendChild(wrapper);
    } catch (error) {
      console.log("未找到回复按钮，可能不在帖子页面或页面未完全加载");
      scheduleInjectRetry();
    } finally {
      injecting = false;
    }
  }

  // 初始化
  addLotteryButton();

  // 监听页面变化（单个观察者，若按钮缺失再尝试注入）
  const outlet = document.querySelector("#main-outlet") || document.body;
  const observer = new MutationObserver(() => {
    if (!document.querySelector(`#${escapeIdForSelector(CONFIG.buttonId)}`)) {
      addLotteryButton();
    }
  });
  observer.observe(outlet, { childList: true, subtree: true });

  // 添加CSS样式
  const style = document.createElement("style");
  style.textContent = `
        .quick-reply-container {
            flex-wrap: wrap !important;
        }
        .quick-reply-wrapper {
            width: 100%;
            margin-top: 8px;
            box-sizing: border-box;
            flex: 0 0 100%;
            order: 9999;
            display: flex;
            justify-content: flex-start;
        }
        .quick-reply-btn:hover {
            opacity: 0.8;
            transform: translateY(-1px);
        }
        .quick-reply-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        .quick-reply-btn {
            transition: all 0.2s ease;
        }
    `;
  document.head.appendChild(style);
})();

// ==UserScript==
// @name         Telegram Ad Filter (Local Blacklist)
// @version      1.5.0
// @description  Collapses messages that contain words from the ad-word list, managed locally.
// @license      MIT
// @author       VChet (Modified by ChatGPT)
// @icon         https://web.telegram.org/favicon.ico
// @namespace    telegram-ad-filter
// @match        https://web.telegram.org/k/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @homepage     https://github.com/VChet/telegram-ad-filter
// @homepageURL  https://github.com/VChet/telegram-ad-filter
// @supportURL   https://github.com/VChet/telegram-ad-filter
// @downloadURL https://update.greasyfork.org/scripts/552434/Telegram%20Ad%20Filter%20%28Local%20Blacklist%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552434/Telegram%20Ad%20Filter%20%28Local%20Blacklist%29.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

// src/DOM.ts
var globalStyles = `
  .bubble:not(.has-advertisement) .advertisement,
  .bubble.has-advertisement .bubble-content *:not(.advertisement),
  .bubble.has-advertisement .reply-markup {
    display: none;
  }
  .advertisement {
    padding: 0.5rem 1rem;
    cursor: pointer;
    white-space: nowrap;
    font-style: italic;
    font-size: var(--messages-text-size);
    font-weight: var(--font-weight-bold);
    color: var(--link-color);
  }
  #telegram-ad-filter-settings {
    display: inline-flex;
    justify-content: center;
    width: 24px;
    font-size: 24px;
    color: transparent;
    text-shadow: 0 0 var(--secondary-text-color);
  }
`;
var frameStyle = `
  inset: 115px auto auto 130px;
  border: 1px solid rgb(0, 0, 0);
  height: 300px;
  margin: 0px;
  max-height: 95%;
  max-width: 95%;
  opacity: 1;
  overflow: auto;
  padding: 0px;
  position: fixed;
  width: 75%;
  z-index: 9999;
  display: block;
`;
var popupStyle = `
  #telegram-ad-filter {
    background: #181818;
    color: #ffffff;
  }
  #telegram-ad-filter textarea {
    resize: vertical;
    width: 100%;
    min-height: 150px;
  }
  #telegram-ad-filter .reset, #telegram-ad-filter .reset a, #telegram-ad-filter_buttons_holder {
    color: inherit;
  }
`;
function addSettingsButton(element, callback) {
  const settingsButton = document.createElement("button");
  settingsButton.classList.add("btn-icon", "rp");
  settingsButton.setAttribute("title", "Telegram Ad Filter Settings");
  const ripple = document.createElement("div");
  ripple.classList.add("c-ripple");
  const icon = document.createElement("span");
  icon.id = "telegram-ad-filter-settings";
  icon.textContent = "\u2699\uFE0F"; // ⚙️
  settingsButton.append(ripple);
  settingsButton.append(icon);
  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    callback();
  });
  element.append(settingsButton);
}
function handleMessageNode(node, adWords) {
  const message = node.querySelector(".message");
  if (!message || node.querySelector(".advertisement")) {
    return;
  }
  const textContent = message.textContent?.toLowerCase();
  const links = [...message.querySelectorAll("a")].reduce((acc, { href }) => {
    if (href) {
      acc.push(href.toLowerCase());
    }
    return acc;
  }, []);
  if (!textContent && !links.length) {
    return;
  }
  const filters = adWords.map((filter) => filter.toLowerCase());
  const hasMatch = filters.some(
    (filter) => textContent?.includes(filter) || links.some((href) => href.includes(filter))
  );
  if (!hasMatch) {
    return;
  }
  const trigger = document.createElement("div");
  trigger.classList.add("advertisement");
  trigger.textContent = "Hidden by filter";
  node.querySelector(".bubble-content")?.prepend(trigger);
  node.classList.add("has-advertisement");
  trigger.addEventListener("click", () => {
    node.classList.remove("has-advertisement");
  });
  message.addEventListener("click", () => {
    node.classList.add("has-advertisement");
  });
}

// src/configs.ts (已修改)
var settingsConfig = {
  id: "telegram-ad-filter",
  frameStyle,
  css: popupStyle,
  title: "Telegram Ad Filter Settings",
  fields: {
    // 更改了字段名和描述，用于本地关键词列表
    adWordsList: {
      label: "黑名单关键词 (每行一个)", // Blacklist keywords (one per line)
      type: "textarea",
      // 提供一些默认的黑名单词语示例
      default: `广告
推广
赚钱
代币
投资
加入
群
频道
福利
邀请
抽奖
空投
交易
项目
平台
币
NFT
VIP
会员
点击这里
私聊`
    }
  }
};

// src/fetch.ts (已移除，其功能整合到 main.ts 的 GM_config 事件中)

// src/main.ts (已修改)
(async () => {
  GM_addStyle(globalStyles);
  let adWords = []; // 用于存储黑名单关键词的数组

  const gmc = new GM_configStruct({
    ...settingsConfig,
    events: {
      init: function() {
        // 从本地配置中读取关键词列表并解析
        const wordsString = this.get("adWordsList").toString();
        adWords = wordsString.split("\n").map(word => word.trim()).filter(Boolean);
        console.log("Telegram Ad Filter: Initialized with ad words:", adWords);
      },
      save: function() {
        // 当用户保存设置时，更新关键词列表
        const wordsString = this.get("adWordsList").toString();
        adWords = wordsString.split("\n").map(word => word.trim()).filter(Boolean);
        console.log("Telegram Ad Filter: Settings saved. Updated ad words:", adWords);
        this.close(); // 保存后关闭设置窗口
      }
    }
  });

  function walk(node) {
    if (!(node instanceof HTMLElement) || !node.nodeType) {
      return;
    }
    let child = null;
    let next = null;
    switch (node.nodeType) {
      case node.ELEMENT_NODE:
      case node.DOCUMENT_NODE:
      case node.DOCUMENT_FRAGMENT_NODE:
        if (node.matches(".chat-utils")) {
          // 确保只添加一次设置按钮
          if (!node.querySelector("#telegram-ad-filter-settings")) {
            addSettingsButton(node, () => {
              gmc.open();
            });
          }
        }
        if (node.matches(".bubble")) {
          handleMessageNode(node, adWords);
        }
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child);
          child = next;
        }
        break;
      case node.TEXT_NODE:
      default:
        break;
    }
  }

  function mutationHandler(mutationRecords) {
    for (const { type, addedNodes } of mutationRecords) {
      if (type === "childList" && typeof addedNodes === "object" && addedNodes.length) {
        for (const node of addedNodes) {
          walk(node);
        }
      }
    }
  }

  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, { childList: true, subtree: true, attributeFilter: ["class"] });

  // 初始页面加载时可能已经有消息，需要进行一次扫描
  walk(document.body);
})();

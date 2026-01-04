// ==UserScript==
// @name         让 ChatGPT 和 Grok 看起来像 Qwen
// @namespace    npm/vite-plugin-monkey
// @version      0.0.2
// @description  让 ChatGPT 和 Grok 网页版使用起来看起来像 qwen.ai
// @license      No license
// @icon         https://registry.npmmirror.com/@lobehub/icons-static-png/1.65.0/files/dark/qwen.png
// @match        https://chatgpt.com/*
// @match        https://grok.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549972/%E8%AE%A9%20ChatGPT%20%E5%92%8C%20Grok%20%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%20Qwen.user.js
// @updateURL https://update.greasyfork.org/scripts/549972/%E8%AE%A9%20ChatGPT%20%E5%92%8C%20Grok%20%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%20Qwen.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const MODEL_NAME_KEY = "MODEL_NAME";
  const SITE_NAME_KEY = "SITE_NAME";
  const MODEL_NAME = _GM_getValue(MODEL_NAME_KEY, "Qwen3-Max-Preview");
  const SITE_NAME = _GM_getValue(SITE_NAME_KEY, "Qwen");
  _GM_registerMenuCommand("自定义显示的模型名", () => {
    const input = prompt("请输入模型名：", MODEL_NAME);
    if (input !== null) {
      _GM_setValue(MODEL_NAME_KEY, input);
      alert(`变量已更新为: ${input}`);
    }
  });
  _GM_registerMenuCommand("自定义显示的站点名", () => {
    const input = prompt("请输入站点名：", SITE_NAME);
    if (input !== null) {
      _GM_setValue(SITE_NAME_KEY, input);
      alert(`变量已更新为: ${input}`);
    }
  });
  const getElements$1 = (node, selector, isSelf = false) => {
    if (isSelf && node.matches(selector)) {
      return [node];
    }
    return Array.from(node.querySelectorAll(selector));
  };
  const initTitle = () => {
    if (document.title === "ChatGPT") {
      document.title = SITE_NAME;
    }
  };
  const updateHeaderText = (node) => {
    const headerTexts = getElements$1(node, ".text-page-header");
    headerTexts.forEach((header) => {
      const deepestText = header.querySelector(":last-child");
      if (deepestText && deepestText.textContent !== `询问${SITE_NAME}，了解更多。`) {
        deepestText.textContent = `询问${SITE_NAME}，了解更多。`;
        console.log("Updated header text");
      }
    });
  };
  const updateModelButtonText = (node) => {
    const modelButtons = getElements$1(
      node,
      ".flex.items-center > button[data-testid] > div",
      node.matches(".flex.items-center > button[data-testid] > div")
    );
    modelButtons.forEach((button) => {
      if (button.textContent === "ChatGPT") {
        button.textContent = MODEL_NAME;
        console.log("Updated model button text");
      }
    });
  };
  const handlePlusButton = (node) => {
    const getPlusButtons = getElements$1(
      node,
      "#page-header button",
      node.matches("#page-header button")
    );
    getPlusButtons.forEach((button) => {
      const originalTexts = ["获取 Plus", "Get Plus"];
      if (originalTexts.includes(button.textContent)) {
        button.textContent = "";
        button.style.opacity = "0";
        console.log("Removed Get Plus button");
      }
    });
  };
  const clearSvgIcon = (node) => {
    const svgIcons = getElements$1(
      node,
      "button > div.icon > svg",
      node.matches("button > div.icon > svg")
    );
    if (svgIcons.length > 0 && svgIcons[0].innerHTML !== "") {
      const img = document.createElement("img");
      img.src = "https://registry.npmmirror.com/@lobehub/icons-static-png/1.65.0/files/dark/qwen.png";
      img.alt = "Qwen Icon";
      img.className = svgIcons[0].getAttribute("class") || "";
      img.style.cssText = Array.from(svgIcons[0].style).map(
        (prop) => `${prop}: ${svgIcons[0].style.getPropertyValue(prop)}`
      ).join("; ");
      img.style.width = "1.5rem";
      img.style.height = "1.25rem";
      svgIcons[0].replaceWith(img);
      console.log("Replaced SVG icon with Qwen image");
    }
  };
  const updateFooterText = (node) => {
    const originalTexts = [
      "ChatGPT can make mistakes. Check important info.",
      "ChatGPT 也可能会犯错。请核查重要信息。"
    ];
    const footerTexts = getElements$1(node, ".text-token-text-secondary>div", node.matches(".text-token-text-secondary>div"));
    footerTexts.forEach((div) => {
      if (originalTexts.includes(div.textContent)) {
        div.textContent = `向 ${SITE_NAME} 发送消息即表示，您同意我们的用户条款并已阅读我们的隐私协议。`;
        console.log("Updated footer text");
      }
    });
  };
  const processNode$1 = (node) => {
    updateHeaderText(node);
    updateModelButtonText(node);
    handlePlusButton(node);
    clearSvgIcon(node);
    updateFooterText(node);
    initTitle();
  };
  function handleGpt() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          processNode$1(node);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    processNode$1(document.body);
    setTimeout(() => processNode$1(document.body), 3250);
  }
  const getElements = (node, selector, isSelf = false) => {
    if (isSelf && node.matches(selector)) {
      return [node];
    }
    return Array.from(node.querySelectorAll(selector));
  };
  const removeUpsell = (node) => {
    const upsellElements = getElements(node, ".upsell-small");
    upsellElements.forEach((element) => {
      element.remove();
      console.log("Removed upsell element");
    });
  };
  const updateCenterText = (node) => {
    const svgs = getElements(node, "div.flex.items-center.justify-center > div > svg");
    svgs.forEach((svg) => {
      const div = document.createElement("div");
      div.textContent = `询问${SITE_NAME}，了解更多。`;
      div.style.textAlign = "center";
      div.style.fontSize = "1rem";
      svg.parentNode?.replaceChild(div, svg);
      console.log("Replaced SVG with center text");
    });
  };
  const replaceSvgWithQwenIcon = (node) => {
    const svgs = getElements(node, "svg.fill-primary");
    svgs.forEach((svg) => {
      const img = document.createElement("img");
      img.src = "https://registry.npmmirror.com/@lobehub/icons-static-png/1.65.0/files/dark/qwen.png";
      svg.replaceWith(img);
    });
  };
  const updateTitle = () => {
    if (document.title === "Grok") {
      document.title = SITE_NAME;
    }
  };
  const updateModelNames = (node) => {
    const modelSpans = getElements(node, "span.inline-block");
    modelSpans.forEach((span) => {
      if (span.textContent.startsWith("Grok")) {
        span.title = span.textContent;
        span.textContent = MODEL_NAME;
      }
    });
  };
  const processNode = (node) => {
    removeUpsell(node);
    updateCenterText(node);
    replaceSvgWithQwenIcon(node);
    updateModelNames(node);
    updateTitle();
  };
  function handleGrok() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          processNode(node);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    processNode(document.body);
    setTimeout(() => processNode(document.body), 3250);
  }
  const url = window.location.href;
  const routeMatcher = [
    {
      pattern: /^https:\/\/chatgpt\.com/,
      handler: handleGpt
    },
    {
      pattern: /^https:\/\/grok\.com/,
      handler: handleGrok
    }
  ];
  console.log("Current URL:", url);
  for (const route of routeMatcher) {
    if (route.pattern.test(url)) {
      route.handler();
      break;
    }
  }

})();
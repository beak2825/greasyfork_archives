// ==UserScript==
// @name         魔方 C 端域名快速切换
// @namespace    global-magic
// @version      2025-09-04
// @description  允许 GlobalMagic 搭建的 C 端页面快速在不同的合规区域名间切换，并且可以跳转到编辑器和活动管理页
// @author       chenzhenrui.me
// @match        https://activity-va.tiktok.com/*
// @match        https://activity.tiktok.com/*
// @match        https://activity-ie.tiktokw.eu/*
// @match        https://activity-ttp2.tiktokw.eu/*
// @match        https://activity-i18n.tiktok.com/*
// @match        https://activity16-normal-useastred.tiktokw.eu/*
// @match        https://activity16-normal-useast5.tiktokw.us/*
// @match        https://activity16-normal-useast8.tiktokw.us/*
// @match        https://activity.us.tiktok.com/*
// @match        https://h5.capcut.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561964/%E9%AD%94%E6%96%B9%20C%20%E7%AB%AF%E5%9F%9F%E5%90%8D%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/561964/%E9%AD%94%E6%96%B9%20C%20%E7%AB%AF%E5%9F%9F%E5%90%8D%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function waitUntil(fn) {
    return new Promise((resolve) => {
      if (fn()) {
        resolve(true);
      } else {
        let timer = setInterval(() => {
          if (fn()) {
            clearInterval(timer);
            resolve(true);
          }
        }, 20);
      }
    });
  }

  const lockBackToAppAction = () => {
    const originalBackToApp = () => {
      console.log("触发了 BackToApp，但被插件拦截了！");
    };

    window.__MAGIC__.tool.backToApp = originalBackToApp;

    Object.defineProperty(window.__MAGIC__.tool, "backToApp", {
      value: originalBackToApp,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  };

  waitUntil(() => !!window.__MAGIC__?.tool).then(() => {
    lockBackToAppAction();
  });

  waitUntil(() => !!window.__MAGIC__?.canvas?.extra?.renderLog).then(() => {
    const renderLog = window.__MAGIC__?.canvas?.extra?.renderLog;
    const renderTime = window.__MAGIC__?.canvas?.extra?.renderTime;
    const lastPublishTimestamp = window.__MAGIC__.canvas.lastPublishTimestamp;
    const activityID = window.__MAGIC__.canvas.activityId;
    const activityVersion = window.__MAGIC__.canvas.activityVersion;
    // 在这里插入一个五颜六色的醒目提示，提醒用户注意渲染日志
    console.log(
      "%c ==== 页面渲染参数 ====",
      "color: #ff4d4f; font-size: 32px; font-weight: bold;"
    );
    console.table({
      renderLog,
      renderTime: new Date(renderTime).toLocaleString(),
      lastPublishTimestamp: new Date(lastPublishTimestamp).toLocaleString(),
      activityID,
      activityVersion,
    });
    console.log(
      "%c ========",
      "color: #ff4d4f; font-size: 18px; font-weight: bold;"
    );
  });

  // 初始化域名配置（如果window上没有的话）
  if (!window.domainSwitcher) {
    window.domainSwitcher = {
      SG: "activity.tiktok.com",

      "EU-TTP": "activity-ie.tiktokw.eu",
      "EU-TTP2": "activity-ttp2.tiktokw.eu",
      "EU: US-EastRed": "activity-i18n.tiktok.com",
      "EU: US-EastRed|2b": "activity16-normal-useastred.tiktokw.eu",
      "US-TTP": "activity16-normal-useast5.tiktokw.us",
      "US-TTP2": "activity16-normal-useast8.tiktokw.us",
      US: "activity.us.tiktok.com",
      VA: "activity-va.tiktok.com",
    };
  }

  // 创建悬浮球容器
  const container = document.createElement("div");
  container.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 999999;
        transition: all 0.3s ease;
    `;

  // 创建悬浮球按钮
  const floatButton = document.createElement("div");
  floatButton.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
  floatButton.innerHTML = "🌐"; // 地球图标
  container.appendChild(floatButton);

  // 创建域名列表面板
  const domainPanel = document.createElement("div");
  domainPanel.style.cssText = `
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 220px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        padding: 15px 0;
        display: none;
        flex-direction: column;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s ease;
    `;
  container.appendChild(domainPanel);

  // 填充域名列表
  function renderDomainList() {
    // 清空现有内容
    domainPanel.innerHTML = "";

    // 添加标题
    const title = document.createElement("div");
    title.style.cssText = `
            padding: 0 15px 10px;
            font-weight: 600;
            color: #4b5563;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        `;
    title.textContent = "切换环境";
    domainPanel.appendChild(title);

    // 获取当前域名
    const currentHost = window.location.host;

    // 添加域名选项
    Object.entries(window.domainSwitcher).forEach(([name, domain]) => {
      const item = document.createElement("div");
      item.style.cssText = `
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.15s ease;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

      // 当前域名高亮显示
      if (currentHost === domain) {
        item.style.backgroundColor = "#eff6ff";
        item.style.color = "#2563eb";
      }

      // 鼠标悬停效果
      item.addEventListener("mouseenter", () => {
        if (currentHost !== domain) {
          item.style.backgroundColor = "#f3f4f6";
        }
      });

      item.addEventListener("mouseleave", () => {
        if (currentHost !== domain) {
          item.style.backgroundColor = "transparent";
        }
      });

      // 点击切换域名
      item.addEventListener("click", () => {
        // 构建新URL，保留协议、路径、查询参数和哈希
        const newUrl = `${window.location.protocol}//${domain}${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.href = newUrl;
      });

      // 域名名称和标识
      item.innerHTML = `
                <span>${name}</span>
                ${
                  currentHost === domain
                    ? '<span style="font-size: 12px;">当前</span>'
                    : ""
                }
            `;

      domainPanel.appendChild(item);
    });

    // Function to create a fixed link button
    function createFixedLinkButton(text, url) {
      const button = document.createElement("div");
      button.style.cssText = `
        padding: 10px 15px;
        cursor: pointer;
        color: #6b7280;
        font-size: 13px;
        transition: background-color 0.15s ease;
      `;
      button.textContent = text;
      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "#f3f4f6";
      });
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "transparent";
      });
      button.addEventListener("click", () => {
        window.open(url, "_blank");
      });
      return button;
    }

    // Define fixed link configurations with URL builder functions
    const fixedLinks = [
      {
        text: "⚙️ 编辑器（SG）",
        baseUrl: "https://magic-sg.tiktok-row.net/",
        buildUrl: function () {
          const activityId = location.href.split("/")[7];
          return `${this.baseUrl}editor/${
            activityId.split("?")[0]
          }?productUuIds=${new URL(window.location.href).searchParams.get(
            "appType"
          )}`;
        },
      },
      {
        text: "🗓 活动管理页（SG）",
        baseUrl: "https://magic-sg.tiktok-row.net/detail/",
        buildUrl: function () {
          // 尝试从__MAGIC__获取eventId，如果不存在则尝试从URL解析
          const eventId =
            window.__MAGIC__?.canvas?.eventId ||
            location.href.split("/")[7]?.split("?")[0];
          return `${this.baseUrl}${eventId}/material/pages`;
        },
      },
    ];

    // Create and append buttons based on configurations
    fixedLinks.forEach((link) => {
      const url = link.buildUrl.call(link);
      const button = createFixedLinkButton(link.text, url);
      domainPanel.appendChild(button);
    });

    // 添加分隔线
    const divider = document.createElement("div");
    divider.style.cssText = `
            height: 1px;
            background-color: #e5e7eb;
            margin: 8px 0;
        `;
    domainPanel.appendChild(divider);

    // 添加配置按钮
    const configBtn = document.createElement("div");
    configBtn.style.cssText = `
            padding: 10px 15px;
            cursor: pointer;
            color: #6b7280;
            font-size: 13px;
            transition: background-color 0.15s ease;
        `;
    configBtn.textContent = "配置域名环境";
    configBtn.addEventListener("mouseenter", () => {
      configBtn.style.backgroundColor = "#f3f4f6";
    });
    configBtn.addEventListener("mouseleave", () => {
      configBtn.style.backgroundColor = "transparent";
    });
    configBtn.addEventListener("click", () => {
      const configStr = prompt(
        "请输入域名配置（JSON格式）：",
        JSON.stringify(window.domainSwitcher, null, 2)
      );

      if (configStr) {
        try {
          const newConfig = JSON.parse(configStr);
          window.domainSwitcher = newConfig;
          renderDomainList(); // 重新渲染列表
        } catch (e) {
          alert("JSON格式错误，请检查后重试！");
        }
      }
    });
    domainPanel.appendChild(configBtn);
  }

  // 初始渲染域名列表
  renderDomainList();

  // 切换面板显示/隐藏状态
  let isExpanded = false;
  floatButton.addEventListener("click", (e) => {
    e.stopPropagation(); // 防止事件冒泡

    isExpanded = !isExpanded;

    if (isExpanded) {
      // 展开面板
      domainPanel.style.display = "flex";
      // 触发动画
      setTimeout(() => {
        domainPanel.style.opacity = "1";
        domainPanel.style.transform = "translateY(0)";
      }, 10);
      // 改变按钮样式
      floatButton.style.backgroundColor = "#ef4444";
      floatButton.style.transform = "rotate(90deg)";
    } else {
      // 收起面板
      domainPanel.style.opacity = "0";
      domainPanel.style.transform = "translateY(10px)";
      setTimeout(() => {
        domainPanel.style.display = "none";
      }, 200);
      // 恢复按钮样式
      floatButton.style.backgroundColor = "#2563eb";
      floatButton.style.transform = "rotate(0)";
    }
  });

  // 点击页面其他地方收起面板
  document.addEventListener("click", () => {
    if (isExpanded) {
      isExpanded = false;
      domainPanel.style.opacity = "0";
      domainPanel.style.transform = "translateY(10px)";
      setTimeout(() => {
        domainPanel.style.display = "none";
      }, 200);
      floatButton.style.backgroundColor = "#2563eb";
      floatButton.style.transform = "rotate(0)";
    }
  });

  // 阻止面板内部点击事件冒泡
  domainPanel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 添加到页面
  document.body.appendChild(container);
})();

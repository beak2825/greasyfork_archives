// ==UserScript==
// @name         新闻联播视频简介重新排版
// @namespace    xueke0114@foxmail.com
// @version      1.0
// @description  添加自动排版功能，优化新闻联播视频下的视频简介栏目中的文字
// @author       Zheng Xueke
// @match        https://tv.cctv.com/*
// @grant        none
// @license      MIT
// @supportURL   https://gitee.com/zheng-xueke/Snippets/issues
// @downloadURL https://update.greasyfork.org/scripts/553279/%E6%96%B0%E9%97%BB%E8%81%94%E6%92%AD%E8%A7%86%E9%A2%91%E7%AE%80%E4%BB%8B%E9%87%8D%E6%96%B0%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/553279/%E6%96%B0%E9%97%BB%E8%81%94%E6%92%AD%E8%A7%86%E9%A2%91%E7%AE%80%E4%BB%8B%E9%87%8D%E6%96%B0%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function waitForDOM() {
    const mediaElements = document.querySelectorAll("video, audio");
    const shadowElement = document.querySelector(".nrjianjie_shadow");
    if (mediaElements.length && shadowElement) {
      shadowElement.style.display = "block";
      blockAutoplay(); //开启自动播放会导致click事件失效
      initFace();
    } else {
      setTimeout(waitForDOM, 100);
    }
  }

  function initFace() {
    const title = document.title;
    if (!title.includes("《新闻联播》")) {
      return;
    }

    const videoIntroContainer = document.querySelector(
      ".nrjianjie_shadow .con ul"
    );
    if (!videoIntroContainer) return;

    const contentParagraph = videoIntroContainer.querySelector("p");
    if (!contentParagraph) return;

    const introTitle = videoIntroContainer.querySelector(".tit");
    if (!introTitle) return;

    // 处理旧数据
    const rawContent = contentParagraph.innerHTML;
    const newContent = processContent(rawContent);

    // 创建新数据容器
    const newContainer = createNewContentContainer(newContent);

    // 挂载新数据容器
    introTitle.parentNode.appendChild(newContainer);

    // 添加排版按钮
    const button = addButton(introTitle);

    // 切换显示新数据容器
    button.addEventListener("click", function () {
      if (newContainer && contentParagraph) {
        // 切换显示状态而不是单纯设置为block/none
        if (
          newContainer.style.display === "none" ||
          newContainer.style.display === ""
        ) {
          newContainer.style.display = "block";
          contentParagraph.style.display = "none";
        } else {
          newContainer.style.display = "none";
          contentParagraph.style.display = "block";
        }
      }
    });
    document.body.appendChild(button);
  }

  function addButton(brotherElement) {
    const rect = brotherElement.getBoundingClientRect();
    // 计算相对于文档的绝对位置（考虑页面滚动）
    const top = rect.top + window.pageYOffset;
    const left = rect.left + window.pageXOffset;

    const button = document.createElement("button");
    button.innerText = "排版优化";
    button.style.cssText = `
      padding: 5px 15px;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      z-index: 2147483647;
      position: absolute;
      top: ${top}px;    
      left: ${left + 100}px;   
      background-color: #ff6b6b;
    `;
    return button;
  }

  function createNewContentContainer(processedContent) {
    // 新内容的主容器
    const newDiv = document.createElement("div");
    newDiv.style.cssText = `
        display: none;
        font-size: 15px;
        line-height: 1.5;
        border-top: 0px solid #ccc;
    `;

    // 添加主持人信息
    const hostName = addHostName();
    newDiv.appendChild(hostName);

    // 添加处理后的内容
    newDiv.innerHTML += processedContent;

    return newDiv;
  }

  function addHostName() {
    const extraInfoParagraph = document.createElement("div");
    extraInfoParagraph.style.cssText = `
        color: #ff6b6b;
        font-size: 18px;
        margin: 6px;
        padding-left: 2px;
    `;

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    const keywordsArray = keywordsMeta.content.split(" ").slice(1, 3);
    extraInfoParagraph.innerText = keywordsArray.join(", ");

    return extraInfoParagraph;
  }

  function processContent(rawContent) {
    // 排版优化2：替换换行符为<br>
    let formattedContent = rawContent.replace(/\n/g, "<br>");

    // 排版优化3：中文和数字之间添加空格
    formattedContent = formattedContent.replace(
      /([\u4e00-\u9fa5])(\d)/g,
      "$1 $2"
    );
    formattedContent = formattedContent.replace(
      /(\d)([\u4e00-\u9fa5])/g,
      "$1 $2"
    );

    // 排版优化4：“前添加空格，”后添加空格
    formattedContent = formattedContent.replace(/“/g, " “");
    formattedContent = formattedContent.replace(/”/g, "” ");

    // 排版优化5：为每行添加横线
    const lines = formattedContent.split("<br>");
    const styledLines = lines.map(
      (line) =>
        `<div style="border-bottom: 1px solid #eee; padding: 5px 0;">${line}</div>`
    );

    return styledLines.join("");
  }

  function blockAutoplay() {
    // 选择所有视频和音频元素选择所有视频和音频元素
    const mediaElements = document.querySelectorAll("video, audio");
    mediaElements.forEach((element) => {
      // 禁用自动播放属性
      element.autoplay = false;
      // 如果元素正在播放，强制暂停
      if (!element.paused) {
        element.pause();
      }
    });
  }

  waitForDOM();
})();

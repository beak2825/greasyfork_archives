// ==UserScript==
// @name         花瓣“去”水印更新提示脚本
// @namespace    https://getquicker.net/User/Actions/388875-星河城野❤
// @version      2025-12-14
// @description  此脚本不应直接安装。它是供其他脚本使用的外部库，要使用该库请加入元指令 // @require https://xxx.xx/xx.js
// @author       小张
// @license      GPL-3.0
// @match        https://huaban.com/*
// @icon         https://dh.z-l.top/assets/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 定义广告相关常量
  const Update_Link_Url =
    "https://ai-chimo.feishu.cn/wiki/LJXXw49ZIihc7fknAoscdPFfnGe";
  const AD_IMAGE_URL =
    "https://img1.pixhost.to/images/10872/670968992_huabanupdate.gif";

  //替换广告链接和广告图片
  function replaceAdLink() {
    const sideCollapsed = document.querySelector(".side-collapsed");
    if (!sideCollapsed) return;

    const firstChild = sideCollapsed.children[0];
    if (!firstChild || !firstChild.classList.contains("MYLD0f_u")) return;

    const adContainer = firstChild;
    // 检查广告容器是否为空（没有内容）
    const isOriginalEmpty = adContainer.innerHTML.trim() === "";

    if (isOriginalEmpty) {
      // 情况1：容器为空，创建新的广告内容
      // 创建广告链接
      const adLink = document.createElement("a");
      adLink.setAttribute("data-click-type", "点击广告");
      // 添加指定的class
      adLink.className = "__0lf9vC8q modalOpenWidth";
      // 添加指定的style
      adLink.style.backgroundColor = "rgb(75, 121, 255)";
      adLink.style.height = "60px";
      adLink.target = "_blank";
      adLink.rel = "noreferrer nofollow";

      // 创建图片
      const img = document.createElement("img");
      img.src = AD_IMAGE_URL;

      // 组装元素 - 不需要关闭按钮容器
      adLink.appendChild(img);
      adContainer.appendChild(adLink);

      // 设置广告链接
      adLink.href = Update_Link_Url;

      // 调整高度以显示广告
      showBanner();
    } else {
      // 情况2：容器有内容，只替换链接和图片，保持其他结构不变
      const adLink = adContainer.querySelector('a[data-click-type="点击广告"]');
      if (adLink) {
        // 替换链接
        adLink.href = Update_Link_Url;

        // 替换图片
        const img = adLink.querySelector("img");
        if (img) {
          img.src = AD_IMAGE_URL;
        }
      }
    }
  }

  // 显示广告，调整高度以显示广告
  function showBanner() {
    const sideCollapsed = document.querySelector(".side-collapsed");
    if (!sideCollapsed) return;

    // 获取当前 style 属性
    let styleText = sideCollapsed.getAttribute("style") || "";

    // 设置显示广告的高度
    styleText = styleText
      .replace(
        /--global-banner-height:\s*\d+px;/,
        "--global-banner-height: 60px;"
      )
      .replace(
        /--total-header-height:\s*\d+px;/,
        "--total-header-height: 140px;"
      );

    // 如果没有找到现有的变量，则添加
    if (!styleText.includes("--global-banner-height")) {
      styleText += " --global-banner-height: 60px;";
    }
    if (!styleText.includes("--total-header-height")) {
      styleText += " --total-header-height: 140px;";
    }

    sideCollapsed.setAttribute("style", styleText);
  }

  // 模拟点击关闭广告
  function closeAd() {
    const sideCollapsed = document.querySelector(".side-collapsed");
    if (!sideCollapsed) return;

    const firstChild = sideCollapsed.children[0];
    if (!firstChild || !firstChild.classList.contains("MYLD0f_u")) return;

    const adContainer = firstChild;
    // 检查容器是否有内容
    if (adContainer.innerHTML.trim() === "") return;

    // 查找关闭广告的按钮
    const closeBtn = adContainer.querySelector(
      '.p7zlqpbo[data-click-type="关闭广告"]'
    );
    if (closeBtn) {
      // 模拟点击事件
      closeBtn.click();
    }
  }

  // 从镜像地址拉取最新版本号
  async function fetchLatestVersion() {
    try {
      const url =
        "https://update.gf.qytechs.cn/scripts/554301/%E8%8A%B1%E7%93%A3%22%E5%8E%BB%22%E6%B0%B4%E5%8D%B0.meta.js";
      const txt = await (await fetch(url)).text();
      const m = txt.match(/^\/\/\s*@version\s+(.+)$/im);
      return m ? m[1].trim() : null;
    } catch (e) {
      return null;
    }
  }

  // 主逻辑：根据版本号和广告容器内容状态执行不同操作
  (async function () {
    const current = GM_info.script.version;
    const latest = await fetchLatestVersion();

    // 检查广告容器状态的函数
    function checkAdContainer() {
      const sideCollapsed = document.querySelector(".side-collapsed");
      if (!sideCollapsed) return null;

      const firstChild = sideCollapsed.children[0];
      if (!firstChild || !firstChild.classList.contains("MYLD0f_u"))
        return null;

      return {
        container: firstChild,
        hasContent: firstChild.innerHTML.trim() !== "",
      };
    }

    // 执行相应操作的函数
    function executeAction() {
      const adStatus = checkAdContainer();

      if (latest && latest !== current) {
        // 版本不同
        if (adStatus && adStatus.hasContent) {
          // 有内容：只替换链接和图片
          replaceAdLink();
        } else if (adStatus) {
          // 空容器：创建新广告并显示
          replaceAdLink();
        }
      } else {
        // 版本相同
        if (adStatus && adStatus.hasContent) {
          // 有内容：模拟点击关闭广告
          closeAd();
        }
      }
    }

    // 根据DOM加载状态执行
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", executeAction);
    } else {
      executeAction();
    }
  })();
})();

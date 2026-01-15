// ==UserScript==
// @name         mn-lord
// @namespace    https://monster-nest.com/
// @version      1.2.0
// @description  永远的太阳
// @license      MIT
// @icon         https://monster-nest.com/favicon.ico
// @match        https://monster-nest.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562539/mn-lord.user.js
// @updateURL https://update.greasyfork.org/scripts/562539/mn-lord.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  const targetUids = [
    1,
2
];
  const targetUsernames = [
    "怪物Z",
    "怪物 Z",
    "怪物z",
    "怪物 z",
    "怪物god"
  ];
  const css = `
  /* 名字金光特效 */
  .sun-god-text {
    color: #FFD700 !important;
    font-weight: 900 !important;
    /* 柔化描边：使用紧贴的高强度深色阴影，而非硬像素描边 */
    text-shadow: 
        0 1px 2px rgba(80, 40, 0, 0.9),
        0 0 2px rgba(80, 40, 0, 0.9),
        0 0 10px #FF8C00, 
        0 0 20px #FFD700 !important;
    animation: sun-text-glow 2s infinite alternate;
    
    /* 核心修复：强制重置所有可能导致位移的布局属性 */
    display: inline !important;
    float: none !important;
    position: static !important;
    margin: 0 !important;
    padding: 0 !important;
    vertical-align: baseline !important;
    transform: none !important;
  }

  @keyframes sun-text-glow {
    0% { 
       text-shadow: 
        0 1px 2px rgba(80, 40, 0, 0.9),
        0 0 2px rgba(80, 40, 0, 0.9),
        0 0 5px #FF8C00;
    }
    100% { 
       text-shadow: 
        0 1px 2px rgba(80, 40, 0, 0.9),
        0 0 2px rgba(80, 40, 0, 0.9),
        0 0 15px #FFD700, 0 0 25px #FF4500;
    }
  }

  .sun-god-avatar {
    position: relative;
    /* 图片层级最高，确保不被特效遮挡 */
    z-index: 5;
    /* 强力金色发光效果 */
    box-shadow: 0 0 15px #FFD700, 0 0 30px #FF8C00, 0 0 45px #FF4500 !important;
    border-radius: 50% !important; 
    animation: sun-pulse 2s infinite alternate, sun-float 3s ease-in-out infinite !important;
    transition: all 0.3s;
    filter: brightness(1.1) contrast(1.1);
  }
  
  .sun-god-avatar:hover {
     transform: scale(1.1);
     /* 悬停时稍微提高，但不要遮挡菜单 */
     z-index: 10;
  }

  .sun-god-container {
      position: relative !important;
      overflow: visible !important;
      /* 解决遮挡问题的关键：提升容器层级，使其高于相邻的 post content */
      z-index: 10 !important; 
      /* 同时建立隔离，管理内部堆叠 */
      isolation: isolate; 
  }
  
  /* Discuz 常见的外层容器，强制显示粒子溢出 */
  .avatar, .pls .avatar, .p_pop, .card_gender {
      overflow: visible !important;
      /* 确保自身也有层级 */
      z-index: auto; 
  }

  /* 针对 Discuz 帖子列表模式可能的遮挡 */
  td.pls {
      overflow: visible !important;
      z-index: 10;
  }

  /* 太阳射线 */
  .sun-god-ray {
    position: absolute;
    top: 50%;
    left: 50%;
    /* 基础长度，动画中会缩放 */
    width: 200%; 
    height: 40px; 
    
    background: linear-gradient(90deg, transparent 10%, rgba(255, 140, 0, 0.8) 40%, rgba(255, 215, 0, 0.8) 50%, rgba(255, 140, 0, 0.8) 60%, transparent 90%);
    height: 2px;
    
    /* 在头像下方 */
    z-index: 1; 
    pointer-events: none;
    opacity: 0.6; /* 半透明 */
    transform-origin: center;
    animation: sun-ray-shine var(--dur, 3s) ease-in-out infinite;
    animation-delay: var(--del);
    filter: drop-shadow(0 0 2px rgba(255, 69, 0, 0.5));
  }

  /* 细小金粒 */
  .sun-god-particle {
    position: absolute;
    top: 50%;
    left: 50%;
    /* 变小 */
    width: var(--p-size, 3px); 
    height: var(--p-size, 3px);
    background: #FFD700; 
    /* 减小阴影半径，更锐利 */
    box-shadow: 0 0 2px #FF8C00;
    border-radius: 50%;
    pointer-events: none;
    z-index: 110 !important; /* 确保比父容器高一点点 */
    opacity: 0.9;
    animation: sun-particle-shoot var(--dur) ease-out infinite;
    animation-delay: var(--del);
  }

  /* Discuz 里包头像的 a 标签通常有类 .avtm，确保不切除内容 */
  .avtm {
      overflow: visible !important;
      position: relative !important;
  }

  .sun-god-avatar {
    position: relative;
    /* 图片层级最高，确保不被特效遮挡 */
    z-index: 200 !important;
    /* 强力金色发光效果 */
    box-shadow: 0 0 15px #FFD700, 0 0 30px #FF8C00, 0 0 45px #FF4500 !important;
    border-radius: 50% !important; 
    animation: sun-pulse 2s infinite alternate, sun-float 3s ease-in-out infinite !important;
    transition: all 0.3s;
    filter: brightness(1.1) contrast(1.1);
  }
  
  .sun-god-avatar:hover {
     transform: scale(1.1);
     z-index: 201 !important;
  }

  /* 细小金粒 */
  .sun-god-particle {
    position: absolute;
    top: 50%;
    left: 50%;
    /* 变小 */
    width: var(--p-size, 3px); 
    height: var(--p-size, 3px);
    background: #FFD700; 
    box-shadow: 0 0 2px #FF8C00;
    border-radius: 50%;
    pointer-events: none;
    
    /* 复用射线的层级策略：使用较低的 z-index */
    z-index: 50 !important; 
    
    opacity: 0.9;
    animation: sun-particle-shoot var(--dur) ease-out infinite;
    animation-delay: var(--del);
  }

  /* 太阳射线 */
  .sun-god-ray {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%; 
    height: 40px; 
    
    background: linear-gradient(90deg, transparent 10%, rgba(255, 140, 0, 0.8) 40%, rgba(255, 215, 0, 0.8) 50%, rgba(255, 140, 0, 0.8) 60%, transparent 90%);
    height: 2px;
    
    z-index: 50 !important; /* 与粒子同级，都在底层 */
    pointer-events: none;
    opacity: 0.6;
    transform-origin: center;
    animation: sun-ray-shine var(--dur, 3s) ease-in-out infinite;
    animation-delay: var(--del);
    filter: drop-shadow(0 0 2px rgba(255, 69, 0, 0.5));
  }


  @keyframes sun-pulse {
    0% {
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.7), 0 0 25px rgba(255, 69, 0, 0.5);
    }
    100% {
      box-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 69, 0, 0.8), 0 0 60px rgba(255, 0, 0, 0.6);
    }
  }

  @keyframes sun-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  @keyframes sun-ray-shine {
    0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(0.5); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(1.3); }
    100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(0.5); }
  }

  @keyframes sun-particle-shoot {
    0% {
      opacity: 1;
      /* 使用动态变量控制起点，防止被大头像完全遮挡 */
      transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--start-dist, 20px)) scale(1);
    }
    100% {
      opacity: 0;
      /* 射出更远 */
      transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--end-dist, 80px)) scale(0);
    }
  }
`;
  function getUidFromUrl(url) {
    if (!url) return null;
    let match = url.match(/[?&]uid=(\d+)/);
    if (match) return parseInt(match[1]);
    match = url.match(/space-uid-(\d+)/);
    if (match) return parseInt(match[1]);
    return null;
  }
  function processAvatars() {
    const links = document.querySelectorAll(
      'a[href*="uid"], a[href*="space-uid"]'
    );
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const uid = getUidFromUrl(href);
      if (uid && targetUids.includes(uid)) {
        const imgs2 = link.querySelectorAll("img");
        imgs2.forEach((img) => applyEffect(img));
      }
    });
    const imgs = document.querySelectorAll('img[src*="uid="]');
    imgs.forEach((img) => {
      const uid = getUidFromUrl(img.src);
      if (uid && targetUids.includes(uid)) {
        applyEffect(img);
      }
    });
  }
  function applyEffect(el) {
    if (!el.classList.contains("sun-god-avatar")) {
      if (el instanceof HTMLImageElement) {
        if (el.width < 20 || el.height < 20) {
          const rect = el.getBoundingClientRect();
          if (rect.width < 20 || rect.height < 20) return;
        }
      }
      el.classList.add("sun-god-avatar");
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.position = "relative";
      wrapper.style.verticalAlign = "middle";
      wrapper.style.lineHeight = "0";
      if (el.parentElement) {
        el.parentElement.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      }
      let container = wrapper;
      let ancestor = container.parentElement;
      const params = new URLSearchParams(window.location.search);
      const isMobileParam = ["yes", "true", "ture", "1", "2"].includes(
        params.get("mobile") || ""
      );
      const isDoProfile = params.get("mod") === "space" && params.get("uid") !== null;
      const isRestrictedMode = isMobileParam && isDoProfile;
      while (ancestor && ancestor !== document.body) {
        const style = getComputedStyle(ancestor);
        const isTargetClass = ancestor.classList.contains("avatar") || ancestor.classList.contains("pls") || ancestor.id === "tath" || ancestor.tagName === "TD" || ancestor.classList.contains("bbda") || ancestor.classList.contains("m") || ancestor.tagName === "DD" || ancestor.tagName === "DL" || ancestor.classList.contains("pml") || ancestor.classList.contains("xld");
        const isHidden = style.overflow === "hidden" || style.overflowX === "hidden" || style.overflowY === "hidden";
        if (isTargetClass || !isRestrictedMode && isHidden) {
          ancestor.style.overflow = "visible";
          if (style.position === "static") {
            ancestor.style.position = "relative";
          }
          const zIndex = parseInt(style.zIndex);
          if (isNaN(zIndex) || zIndex < 10) {
            ancestor.style.zIndex = "100";
          }
        }
        if (ancestor.tagName === "TABLE") break;
        ancestor = ancestor.parentElement;
      }
      if (container) {
        container.classList.add("sun-god-container");
        const rect = el.getBoundingClientRect();
        const radius = Math.max(rect.width, rect.height, 48) / 2;
        const rayCount = 10;
        for (let j = 0; j < rayCount; j++) {
          const ray = document.createElement("span");
          ray.className = "sun-god-ray";
          const sector = 360 / rayCount;
          const angle = j * sector + Math.random() * sector * 0.8;
          const del = Math.random() * 2;
          const dur = 2.5 + Math.random() * 2;
          ray.style.setProperty("--angle", `${angle}deg`);
          ray.style.setProperty("--del", `-${del}s`);
          ray.style.setProperty("--dur", `${dur}s`);
          container.appendChild(ray);
        }
        const particleCount = 20 + Math.floor((radius - 24) / 10);
        const pSize = Math.max(3, radius / 8);
        for (let i = 0; i < particleCount; i++) {
          const span = document.createElement("span");
          span.className = "sun-god-particle";
          const angle = Math.random() * 360;
          const startDist = radius * 0.5 + Math.random() * (radius * 0.3);
          const endDist = radius * 1.5 + Math.random() * radius;
          const dur = 1 + Math.random() * 1.5;
          const del = Math.random() * 2;
          span.style.setProperty("--angle", `${angle}deg`);
          span.style.setProperty("--start-dist", `${startDist}px`);
          span.style.setProperty("--end-dist", `${endDist}px`);
          span.style.setProperty("--dur", `${dur}s`);
          span.style.setProperty("--del", `-${del}s`);
          span.style.setProperty("--p-size", `${pSize}px`);
          container.appendChild(span);
        }
      }
      console.log("Applied sun effect with particles to", el);
    }
  }
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function processUsernames() {
    if (targetUsernames.length === 0) return;
    const sortedNames = [...targetUsernames].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(
      `(${sortedNames.map(escapeRegExp).join("|")})`,
      "g"
    );
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.textContent || !node.textContent.trim())
            return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.classList.contains("sun-god-text") || parent.classList.contains("sun-god-avatar") || parent.classList.contains("sun-god-particle") || parent.classList.contains("sun-god-ray")) {
            return NodeFilter.FILTER_REJECT;
          }
          const tag = parent.tagName;
          if ([
            "SCRIPT",
            "STYLE",
            "TEXTAREA",
            "INPUT",
            "SELECT",
            "OPTION",
            "CODE",
            "PRE"
          ].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          for (const name of targetUsernames) {
            if (node.textContent.includes(name)) return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );
    const nodesToProcess = [];
    while (walker.nextNode()) {
      nodesToProcess.push(walker.currentNode);
    }
    nodesToProcess.forEach((node) => {
      const text = node.textContent;
      pattern.lastIndex = 0;
      if (!pattern.test(text)) return;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const before = text.slice(lastIndex, match.index);
        if (before) fragment.appendChild(document.createTextNode(before));
        const span = document.createElement("span");
        span.className = "sun-god-text";
        span.textContent = match[0];
        fragment.appendChild(span);
        lastIndex = pattern.lastIndex;
      }
      const after = text.slice(lastIndex);
      if (after) fragment.appendChild(document.createTextNode(after));
      node.replaceWith(fragment);
    });
  }
  _GM_addStyle(css);
  function processAll() {
    processAvatars();
    processUsernames();
  }
  processAll();
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }
    if (shouldUpdate) {
      processAll();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  console.log("Discuz Sun God Script Loaded");

})();
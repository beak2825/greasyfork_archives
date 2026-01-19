// ==UserScript==
// @name         IThome Pro fix
// @version      4.8.0
// @description  优化ithome网页端浏览效果-修复版
// @match        *://*.ithome.com/*
// @run-at       document-start
// @namespace    https://github.com/wang93wei/IThome-Pro-fix
// @supportURL   https://github.com/wang93wei/IThome-Pro-fix/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562621/IThome%20Pro%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562621/IThome%20Pro%20fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 全局配置对象
   * 可以根据需要修改这些选项来启用或禁用特定功能
   */
  const CONFIG = {
    // 是否显示评论框（true：显示，false：隐藏）
    showCommentBox: false,
    
    // 是否自动加载更多内容（true：启用，false：禁用）
    autoLoadMore: true,
    
    // 是否自动加载图片（true：启用，false：禁用）
    autoLoadImages: true,
    
    // 是否启用图片圆角效果（true：启用，false：禁用）
    roundedImages: true,
    
    // 是否隐藏广告（true：隐藏，false：显示）
    hideAds: true,
    
    // 鼠标移动事件触发间隔（毫秒）
    MOUSEMOVE_INTERVAL: 100,
    
    // 保持页面活跃的持续时间（毫秒）
    MOUSEMOVE_DURATION: 5000,
    
    // 初始延迟时间（毫秒）
    INITIAL_DELAY: 1000,
    
    // 滚动延迟时间（毫秒）
    SCROLL_DELAY: 100,
    
    // 处理延迟时间（毫秒）
    PROCESSING_DELAY: 200,
    
    // MutationObserver防抖时间（毫秒）
    MUTATION_DEBOUNCE: 300,
    
    // 自动点击加载更多按钮的防抖时间（毫秒）
    AUTO_CLICK_DEBOUNCE: 500
  };

  // 使用Set代替WeakSet，避免元素被垃圾回收导致重复处理
  const processedImages = new Set();
  const processedElements = new Set();
  const originalStyles = new Map();

  /**
   * 创建隐藏样式的style元素
   * 用于在页面加载完成前隐藏原始内容，避免闪烁
   */
  const hideStyle = document.createElement("style");
  hideStyle.id = "ithome-pro-fix-style";
  hideStyle.innerHTML = `
    body { opacity: 0; }
    #rm-login-modal, #rm-login-modal *, #login-guide-box { display: none !important; }
  `;
  
  /**
   * 添加隐藏样式到页面
   * 检查是否已存在，避免重复添加
   */
  const addHideStyle = () => {
    if (!document.getElementById("ithome-pro-fix-style")) {
      document.head.appendChild(hideStyle);
    }
  };

  // 立即添加隐藏样式
  addHideStyle();

  /**
   * 首页重定向逻辑
   * 自动跳转到blog页面，提升浏览体验
   */
  if (
    window.location.href === "https://www.ithome.com" ||
    window.location.href === "https://www.ithome.com/"
  ) {
    window.location.replace("https://www.ithome.com/blog/");
    return;
  }

  // blog页面加载完成前隐藏原始内容
  if (window.location.href.startsWith("https://www.ithome.com/blog/")) {
    addHideStyle();
  }

  /**
   * 保持页面活跃
   * 通过定期触发mousemove事件来防止登录弹窗出现
   */
  function keepPageActive() {
    const event = new Event("mousemove", { bubbles: true, cancelable: true });

    // 设置定时器，定期触发mousemove事件
    const intervalId = setInterval(() => {
      document.dispatchEvent(event);
    }, CONFIG.MOUSEMOVE_INTERVAL);

    // 指定时间后停止触发
    setTimeout(() => {
      clearInterval(intervalId);
      console.log("Stopped keeping page active.");
    }, CONFIG.MOUSEMOVE_DURATION);
  }

  // 启动页面活跃保持机制
  keepPageActive();

  /**
   * 强制加载图片
   * 移除懒加载属性，立即加载图片
   * @param {HTMLImageElement} img - 要处理的图片元素
   */
  const forceLoadImage = (img) => {
    // 移除loading属性
    if (img.hasAttribute("loading")) {
      img.removeAttribute("loading");
    }
    // 移除lazy类
    if (img.classList.contains("lazy")) {
      img.classList.remove("lazy");
    }
    // 从data-src加载图片
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    // 从data-original加载图片
    if (img.dataset.original) {
      img.src = img.dataset.original;
    }
    // 设置为立即加载
    img.loading = "eager";
  };

  /**
   * 隐藏页面上的广告和不需要的元素
   * 通过CSS display: none隐藏指定的选择器元素
   */
  const hideElements = () => {
    try {
      // 定义要隐藏的元素选择器
      const selectors = [
        // 导航栏和顶部元素
        "#nav, #top, #tt, #side_func, #fls, #fi, #lns",
        
        // 首页侧边栏
        "#list > div.fr.fx:last-child",
        
        // 文章页面的各种元素
        "#dt > div.fl.content:first-child > div.cv:first-child",
        "#dt > div.fl.content:first-child > div.newsgrade:nth-child(6)",
        "#dt > div.fl.content:first-child > div.shareto:nth-child(7)",
        "#dt > div.fl.content:first-child > iframe.dajia:nth-child(10)",
        "#dt > div.fl.content:first-child > div.newsgrade:nth-child(8)",
        "#dt > div.fl.content:first-child > div.newserror:nth-child(7)",
        "#dt > div.fl.content:first-child > div.newsreward:nth-child(6)",
        "#dt > div.fl.content:first-child > div.shareto:nth-child(9)",
        "#dt > div.fl.content:first-child > div.related_post:nth-child(8)",
        "#dt > div.fl.content:first-child > div.newserror:nth-child(5)",
        
        // 登录弹窗
        "#rm-login-modal > div.modal.has-title.loaded",
        "#login-guide-box",
        
        // 广告元素
        "#paragraph > p.ad-tips:last-child",
        "#paragraph > p.ad-tips",
        '[id^="ad-id-"]',
        "div.-hongbao-container.bb:nth-child(6)",
        
        // 其他不需要的元素
        "#paragraph > div.tougao-user:nth-child(2)",
        ".dajia",
        "#paragraph > div.tagging1:last-child",
        "#dt > div.fr.fx:last-child"
      ];

      // 根据配置决定是否隐藏评论框
      if (!CONFIG.showCommentBox) {
        selectors.push("#postcomment3");
      }

      // 遍历所有选择器并隐藏匹配的元素
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.style.display = "none";
        });
      });
    } catch (error) {
      console.error("Error in hideElements:", error);
    }
  };

  /**
   * 图片样式配置
   * 定义不同类型图片的样式
   */
  const imageStyles = new Map([
    // 首页图片样式
    ['home', {
      border: "3px solid #CCC",
      borderRadius: "12px",
      display: "inline-block",
      overflow: "hidden"
    }],
    // 视频播放器样式
    ['video', {
      border: "3px solid #CCC",
      borderRadius: "12px",
      overflow: "hidden",
      maxWidth: "100%",
      display: "block",
      margin: "0 auto"
    }],
    // 长图样式
    ['longImage', {
      borderRadius: "12px",
      border: "3px solid #CCC",
      width: "400px",
      maxWidth: "400px",
      height: "auto",
      objectFit: "cover",
      overflow: "hidden"
    }],
    // 普通图片样式
    ['regular', {
      borderRadius: "12px",
      border: "3px solid #CCC",
      maxWidth: "450px"
    }]
  ]);

  /**
   * 处理单个图片元素
   * 根据图片类型应用相应的样式
   * @param {HTMLImageElement} image - 要处理的图片元素
   */
  const processImage = (image) => {
    try {
      // 生成唯一标识符，避免重复处理
      const imageId = image.getAttribute('data-id') || image.src || Math.random().toString();
      if (processedImages.has(imageId)) return;
      
      // 跳过评论区的图片
      if (image.closest("#post_comm")) return;
      // 跳过标题logo
      if (image.classList.contains("titleLogo")) return;
      // 跳过懒加载的表情符号
      if (image.classList.contains("lazy") && image.classList.contains("emoji"))
        return;
      // 跳过软媒表情符号
      if (
        image.classList.contains("ruanmei-emoji") &&
        image.classList.contains("emoji")
      )
        return;
      // 跳过图片查看器和已缩放的图片
      if (image.id === "image-viewer" || image.classList.contains("zoomed"))
        return;
      // 跳过评论图片
      if (image.classList.contains("comment-image")) return;

      // 处理首页图片（在a.img标签内）
      if (image.closest("a.img")) {
        const anchor = image.closest("a.img");
        if (!anchor.classList.contains("processed")) {
          Object.assign(anchor.style, imageStyles.get('home'));
          anchor.classList.add("processed");
          processedImages.add(imageId);
        }
      } 
      // 处理视频播放器中的图片
      else if (image.closest(".ithome_super_player")) {
        const videoPlayer = image.closest(".ithome_super_player");
        if (!videoPlayer.parentNode.classList.contains("processed")) {
          // 创建包装器
          const wrapper = document.createElement("div");
          Object.assign(wrapper.style, imageStyles.get('video'));
          wrapper.classList.add("processed");
          videoPlayer.parentNode.insertBefore(wrapper, videoPlayer);
          wrapper.appendChild(videoPlayer);

          // 调整视频封面图片尺寸
          const img = videoPlayer.querySelector("img");
          if (img) {
            const imgWidth = img.getAttribute("w");
            const imgHeight = img.getAttribute("h");
            const parentHeight = wrapper.offsetHeight;

            if (imgWidth > wrapper.offsetWidth) {
              // 计算宽高比并调整尺寸
              const aspectRatio = imgWidth / imgHeight;
              img.style.height = `${parentHeight}px`;
              img.style.width = `${parentHeight * aspectRatio}px`;
              img.style.objectFit = "cover";
            } else {
              img.style.width = `${imgWidth}px`;
              img.style.height = `${imgHeight}px`;
            }
          }
          processedImages.add(imageId);
        }
      } 
      // 处理普通图片
      else {
        // 根据高度判断是否为长图
        if (image.height > 1000) {
          Object.assign(image.style, imageStyles.get('longImage'));
        } else {
          Object.assign(image.style, imageStyles.get('regular'));
        }
        processedImages.add(imageId);
      }
    } catch (error) {
      console.error("Error in processImage:", error);
    }
  };

  /**
   * 设置所有图片的圆角样式
   * 遍历页面上的所有img元素并应用样式
   */
  function setRoundedImages() {
    try {
      document.querySelectorAll("img").forEach((image) => processImage(image));
    } catch (error) {
      console.error("Error in setRoundedImages:", error);
    }
  }

  /**
   * 样式配置
   * 定义各种元素的样式
   */
  const styleConfig = new Map([
    // 头部图片样式
    ['headerImage', {
      borderRadius: "12px",
      border: "3px solid #CCC"
    }],
    // 圆角样式
    ['rounded', {
      borderRadius: "12px"
    }],
    // 评论框样式
    ['addComm', {
      borderRadius: "0px 0px 12px 12px"
    }],
    // 卡片样式
    ['card', {
      borderRadius: "12px",
      transform: "scale(0.8)"
    }]
  ]);

  /**
   * 设置头部图片的样式
   * 为列表页面的头部图片添加圆角和边框
   */
  const styleHeaderImage = () => {
    try {
      const headerImages = document.querySelectorAll(".list .entry .headerimage");

      headerImages.forEach((image) => {
        const imageId = image.getAttribute('data-id') || image.src || Math.random().toString();
        if (!processedImages.has(imageId)) {
          Object.assign(image.style, styleConfig.get('headerImage'));
          processedImages.add(imageId);
        }
      });
    } catch (error) {
      console.error("Error in styleHeaderImage:", error);
    }
  };

  /**
   * 将图片包装在p标签中
   * 用于多图连续排列时插入间隔
   */
  function wrapImagesInP() {
    try {
      // blog页面不需要处理
      if (window.location.href.startsWith("https://www.ithome.com/blog/")) return;
      
      document.querySelectorAll("img").forEach((image) => {
        // 跳过评论区的图片
        if (image.closest("#post_comm")) return;
        // 跳过视频播放器中的图片
        if (image.closest(".ithome_super_player")) return;
        // 跳过表情符号
        if (
          image.classList.contains("ruanmei-emoji") &&
          image.classList.contains("emoji")
        )
          return;
        // 跳过视频播放器元素
        if (image.classList.contains("ithome_super_player")) return;
        // 跳过已经在p标签中且是唯一子元素的图片
        if (
          image.parentNode.tagName.toLowerCase() === "p" &&
          image.parentNode.children.length === 1
        )
          return;
        // 跳过过小的图片（可能是图标）
        if (image.width < 25 || image.height < 20) return;

        // 创建p标签并包装图片
        const p = document.createElement("p");
        p.style.textAlign = "center";
        p.style.margin = "0";
        p.setAttribute("data-vmark", "f5e8");
        image.parentNode.insertBefore(p, image);
        p.appendChild(image);
      });
    } catch (error) {
      console.error("Error in wrapImagesInP:", error);
    }
  }

  /**
   * 处理iframe元素
   * 为视频iframe添加圆角和边框
   */
  const processIframes = () => {
    try {
      // 选择所有视频iframe（包括IThome和Bilibili）
      const iframes = document.querySelectorAll(
        '.content .post_content iframe.ithome_video, .content .post_content iframe[src*="player.bilibili.com"]',
      );

      iframes.forEach((iframe) => {
        const iframeId = iframe.getAttribute('data-id') || iframe.src || Math.random().toString();
        if (!processedElements.has(iframeId) && !iframe.classList.contains("processed")) {
          // 应用样式
          Object.assign(iframe.style, {
            borderRadius: "12px",
            border: "3px solid #CCC",
            display: "block",
            margin: "0 auto",
            overflow: "hidden"
          });
          iframe.classList.add("processed");
          processedElements.add(iframeId);
        }
      });
    } catch (error) {
      console.error("Error in processIframes:", error);
    }
  };

  /**
   * 设置元素的圆角样式
   * 为评论框、引用块、卡片等元素添加圆角
   */
  const setRounded = () => {
    try {
      // 选择所有需要圆角的元素
      const roundeds = document.querySelectorAll(
        ".comm_list ul.list li.entry ul.reply, .content .post_content blockquote, " +
          ".add_comm input#btnComment, .card, span.card",
      );
      roundeds.forEach((rounded) => Object.assign(rounded.style, styleConfig.get('rounded')));

      // 设置评论框的圆角
      document.querySelectorAll(".add_comm").forEach((addCommElement) => {
        Object.assign(addCommElement.style, styleConfig.get('addComm'));
      });

      // 设置卡片的样式
      document.querySelectorAll(".card, span.card").forEach((card) => {
        Object.assign(card.style, styleConfig.get('card'));
      });
    } catch (error) {
      console.error("Error in setRounded:", error);
    }
  };

  /**
   * 移除首页信息流广告
   * 移除内容为空的广告元素
   */
  function removeAds() {
    try {
      document
        .querySelectorAll("div.bb.clearfix > div.fl > ul.bl > li")
        .forEach((element) => {
          // 如果内容为空，则移除该元素
          if (element.querySelector("div.c > div.m:empty")) element.remove();
        });
    } catch (error) {
      console.error("Error in removeAds:", error);
    }
  }

  /**
   * 防抖函数
   * 延迟执行函数，避免频繁调用
   * @param {Function} fn - 要防抖的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function} 防抖后的函数
   */
  const debounce = (fn, delay = 500) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /**
   * 自动点击"加载更多"按钮
   * 当按钮进入视口时自动点击
   */
  const autoClickLoadMore = async () => {
    try {
      // 根据配置决定是否启用
      if (!CONFIG.autoLoadMore) return;

      // 查找"加载更多"按钮
      const loadMoreButton = document.querySelector("a.more");

      if (!loadMoreButton) return;

      // 检查按钮是否在视口中
      const rect = loadMoreButton.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      // 如果可见，则点击按钮
      if (isVisible) {
        loadMoreButton.click();
      }
    } catch (error) {
      console.error("Error in autoClickLoadMore:", error);
    }
  };

  // 创建防抖版本的自加载函数
  const debouncedAutoClickLoadMore = debounce(autoClickLoadMore, CONFIG.AUTO_CLICK_DEBOUNCE);

  // 监听滚动事件，自动加载更多内容
  window.addEventListener("scroll", debouncedAutoClickLoadMore);

  // 初始化时执行一次自动加载
  (async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, CONFIG.INITIAL_DELAY));
      await autoClickLoadMore();
    } catch (error) {
      console.error("Error in initial auto load:", error);
    }
  })();

  /**
   * 强制加载评论区
   * 通过滚动到底部触发评论区的加载
   */
  const forceLoadComments = async () => {
    try {
      // 创建一个不可见的spacer元素
      const spacer = document.createElement("div");
      Object.assign(spacer.style, {
        height: "100vh",
        visibility: "hidden"
      });
      document.body.appendChild(spacer);

      // 滚动到底部
      window.scrollTo(0, document.body.scrollHeight);

      // 等待一段时间让评论区加载
      await new Promise(resolve => setTimeout(resolve, CONFIG.SCROLL_DELAY));

      // 移除spacer并滚动回顶部
      spacer.remove();
      window.scrollTo(0, 0);

      // 隐藏不需要的元素
      hideElements();
    } catch (error) {
      console.error("Error in forceLoadComments:", error);
    }
  };

  /**
   * 包装器样式配置
   * 定义列表项包装器的样式
   */
  const wrapperStyles = new Map([
    // 包装器基础样式
    ['hoverWrapper', {
      position: "relative",
      padding: "12px 16px",
      borderRadius: "12px",
      overflow: "hidden",
      margin: "16px 0"
    }],
    // 鼠标悬停样式
    ['hover', {
      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)"
    }],
    // 正常状态样式
    ['normal', {
      boxShadow: "none",
      backgroundColor: "transparent"
    }]
  ]);

  /**
   * 获取背景颜色
   * 根据系统的深色模式设置返回相应的背景色
   * @returns {string} 背景颜色值
   */
  const getBackgroundColor = () => {
    return window.matchMedia && 
           window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "#333333"
      : "#f9f9f9";
  };

  /**
   * 使列表项可点击
   * 将列表项包装在div中，点击整个区域可以跳转到文章
   */
  const makeListItemsClickable = () => {
    try {
      const listItems = document.querySelectorAll(".bl > li");

      listItems.forEach((li) => {
        // 跳过已经包装过的列表项
        if (li.closest('.hover-wrapper')) return;

        // 创建包装器
        const wrapper = document.createElement("div");
        wrapper.classList.add("hover-wrapper");
        Object.assign(wrapper.style, wrapperStyles.get('hoverWrapper'));

        // 将列表项插入到包装器中
        li.parentNode.insertBefore(wrapper, li);
        wrapper.appendChild(li);

        // 获取标题链接
        const titleLink = li.querySelector("h2 a");

        if (titleLink) {
          // 将链接替换为纯文本
          const titleText = document.createTextNode(titleLink.textContent);
          titleLink.replaceWith(titleText);

          // 设置包装器为可点击
          wrapper.style.cursor = "pointer";
          wrapper.addEventListener("click", () => {
            window.open(titleLink.href, titleLink.target ?? "_self");
          });

          // 鼠标悬停效果
          wrapper.addEventListener("mouseover", () => {
            Object.assign(wrapper.style, wrapperStyles.get('hover'));
            wrapper.style.backgroundColor = getBackgroundColor();
          });

          // 鼠标移出效果
          wrapper.addEventListener("mouseout", () => {
            Object.assign(wrapper.style, wrapperStyles.get('normal'));
          });
        }
      });
    } catch (error) {
      console.error("Error in makeListItemsClickable:", error);
    }
  };

  /**
   * 设置首页布局
   * 调整首页元素的宽度
   */
  const setHome = () => {
    try {
      const divs = document.querySelectorAll("div.fl");
      divs.forEach((div) => {
        div.style.width = "870px";
      });
    } catch (error) {
      console.error("Error in setHome:", error);
    }
  };

  /**
   * 移除列表项的上边距
   * 使列表项紧密排列
   */
  const removeMarginTop = () => {
    try {
      const hoverWrappers = document.querySelectorAll(".hover-wrapper");
      hoverWrappers.forEach((hoverWrapper) => {
        const listItems = hoverWrapper.querySelectorAll("li");
        listItems.forEach((item) => {
          item.style.marginTop = "0";
        });
      });
    } catch (error) {
      console.error("Error in removeMarginTop:", error);
    }
  };

  /**
   * 设置内容区域宽度
   * 调整文章内容区域的宽度
   */
  const setDivWidthTo590 = () => {
    try {
      const divs = document.querySelectorAll("div.c");
      divs.forEach((div) => {
        div.style.width = "640px";
      });
    } catch (error) {
      console.error("Error in setDivWidthTo590:", error);
    }
  };

  /**
   * 初始化页面
   * 执行所有页面初始化操作
   */
  const initializePage = () => {
    makeListItemsClickable();
    setHome();
    removeMarginTop();
    setDivWidthTo590();
  };

  /**
   * 替换图片包装器
   * 将图片包装器改为可点击缩放的形式
   */
  const replaceImageWrapper = () => {
    try {
      const imageWrappers = document.querySelectorAll(
        ".post-img-list a.img-wrapper",
      );

      imageWrappers.forEach((wrapper) => {
        const img = wrapper.querySelector("img");
        if (img) {
          const imageId = img.getAttribute('data-id') || img.src || Math.random().toString();
          if (!processedImages.has(imageId)) {
            const parent = wrapper.parentElement;

            // 修改类名
            wrapper.classList.remove("img-wrapper");
            wrapper.classList.add("img-click");

            // 移除href属性，阻止默认跳转
            wrapper.removeAttribute("href");

            // 保存原始尺寸
            const originalWidth = img.style.width;
            const originalHeight = img.style.height;
            originalStyles.set(imageId, { width: originalWidth, height: originalHeight });

            // 设置初始样式（缩小显示）
            Object.assign(img.style, {
              width: "30%",
              height: "auto",
              borderRadius: "12px",
              border: "3px solid #CCC"
            });

            // 添加点击缩放功能
            let isZoomed = false;

            img.addEventListener("click", () => {
              try {
                if (isZoomed) {
                  // 恢复原始尺寸
                  const original = originalStyles.get(imageId);
                  Object.assign(img.style, {
                    width: original?.width || "30%",
                    height: original?.height || "auto"
                  });
                } else {
                  // 放大到100%
                  img.style.width = "100%";
                }
                img.style.height = "auto";
                isZoomed = !isZoomed;
              } catch (error) {
                console.error("Error in image click handler:", error);
              }
            });

            processedImages.add(imageId);
          }
        }
      });
    } catch (error) {
      console.error("Error in replaceImageWrapper:", error);
    }
  };

  /**
   * 处理新添加的内容
   * 当DOM发生变化时，对新内容应用所有样式
   */
  const processNewContent = () => {
    try {
      wrapImagesInP();
      setRounded();
      removeAds();
      hideElements();
      setRoundedImages();
      styleHeaderImage();
      initializePage();
      replaceImageWrapper();
    } catch (error) {
      console.error("Error in processNewContent:", error);
    }
  };

  /**
   * 监听DOM变化
   * 使用MutationObserver监听DOM变化，自动处理新添加的内容
   */
  const observeDOM = () => {
    let isProcessing = false;
    let debounceTimer = null;

    const observer = new MutationObserver((mutationsList) => {
      // 如果正在处理，则跳过
      if (isProcessing) return;

      // 清除之前的定时器
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        isProcessing = true;

        try {
          // 遍历所有变化
          for (const mutation of mutationsList) {
            // 只处理子节点变化
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
              // 检查是否有新内容
              const hasNewContent = Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  return !node.classList.contains('hover-wrapper') &&
                         !node.classList.contains('processed') &&
                         (node.querySelector && (
                           node.querySelector('.bl > li') ||
                           node.querySelector('img') ||
                           node.querySelector('.content')
                         ));
                }
                return false;
              });

              // 如果有新内容，则处理
              if (hasNewContent) {
                processNewContent();

                // 强制加载新内容中的图片
                mutation.addedNodes.forEach(node => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                    images.forEach(img => {
                      forceLoadImage(img);
                    });
                  }
                });
              }
            }
          }
        } catch (error) {
          console.error("Error in MutationObserver callback:", error);
        } finally {
          // 延迟重置处理标志
          setTimeout(() => {
            isProcessing = false;
          }, CONFIG.PROCESSING_DELAY);
        }
      }, CONFIG.MUTATION_DEBOUNCE);
    });

    // 监听整个body的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });
  };

  /**
   * 页面加载完成后的初始化
   * 执行所有初始化操作并显示页面
   */
  window.addEventListener("load", async () => {
    try {
      // 执行所有初始化操作
      hideElements();
      forceLoadComments();
      removeAds();
      wrapImagesInP();
      setRounded();
      processIframes();
      setRoundedImages();
      styleHeaderImage();
      initializePage();
      replaceImageWrapper();
      observeDOM();

      // 显示页面
      document.body.style.opacity = "1";

      // 根据配置决定是否自动加载图片
      if (CONFIG.autoLoadImages) {
        document.querySelectorAll("img").forEach((img) => {
          forceLoadImage(img);
        });
      }
    } catch (error) {
      console.error("Error in window load handler:", error);
      // 即使出错也要显示页面
      document.body.style.opacity = "1";
    }
  });
})();

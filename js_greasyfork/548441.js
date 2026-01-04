// ==UserScript==
// @name         CSS Extractor for Lanhu
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  从蓝湖网站上提取CSS代码并打印到控制台
// @author       TikeAI
// @match        https://lanhuapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanhuapp.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548441/CSS%20Extractor%20for%20Lanhu.user.js
// @updateURL https://update.greasyfork.org/scripts/548441/CSS%20Extractor%20for%20Lanhu.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定义抽屉元素类型
  /**
   * @typedef {HTMLDivElement & { disconnect: VoidFunction }} DrawerElement
   */

  // 全局引用对象，用于存储当前抽屉元素和CSS内容
  let ref = {
    current: null,
    css: "",
  };

  /**
   * 观察抽屉元素变化的函数
   * @param {DrawerElement} el - 抽屉元素
   */
  function observeDrawer(el) {
    // 如果存在之前的抽屉元素，断开其观察器连接并清空CSS
    if (ref.current) {
      ref.current.disconnect && ref.current.disconnect();
      ref.css = "";
    }
    ref.current = el;

    // 使用防抖处理观察到的变化
    let obsFn = debounce(
      async () => {
        // 查找代码详情元素
        let detailbox = el.querySelector(".annotation_item.code_detail");
        let codebox = detailbox?.querySelector(".code_box");

        let anchor = null;
        let css = "";
        // 获取原本的css样式
        {
          if (codebox) {
            // 如果存在代码框，直接获取其中的CSS内容
            anchor = detailbox;
            css = codebox.textContent;
          } else {
            // 否则从标注项中获取尺寸信息
            let itembox = last(
              Array.from(
                el.querySelectorAll(".annotation_container > .annotation_item")
              )
            );
            anchor = itembox;

            // 查找包含"大小"的列表项
            let list = el.querySelectorAll(
              ".annotation_container > .annotation_item li"
            );
            let sizebox = Array.from(list).find((li) => {
              return trim(li.textContent).startsWith("大小");
            });

            if (sizebox) {
              // 提取宽度和高度信息
              let sizeElements = Array.from(
                sizebox.querySelectorAll(".item_two")
              );
              if (sizeElements.length >= 2) {
                let width = trim(sizeElements[0].textContent);
                let height = trim(sizeElements[1].textContent);
                css = `width: ${width}; height: ${height};`;
              }
            }
          }
          // 将CSS包装在.app选择器中
          css = `.app { ${css} }`;
        }

        // 如果CSS内容发生变化
        if (ref.css !== css) {
          ref.css = css;

          try {
            // 直接打印CSS到控制台
            console.log("%c[CSS提取]", "color:#3799a8;", css);

            // 在页面上显示提取的CSS
            showCssPopup(css);
          } catch (e) {
            console.warn("%c[error]", "color:red;", e);
          }
        }
      },
      100,
      { leading: false, trailing: true }
    );

    // 创建并配置MutationObserver来观察元素变化
    let obs = new MutationObserver(obsFn);
    obs.observe(el, {
      characterData: true,
      subtree: true,
      childList: true,
    });
    // 添加断开观察器的方法
    el.disconnect = () => {
      obs.disconnect();
    };
  }

  /**
   * 格式化CSS代码使其更易读
   * @param {string} css - 原始CSS代码
   * @returns {string} - 格式化后的CSS代码
   */
  function formatCss(css) {
    // 移除多余空格和换行
    let formatted = css.replace(/\s+/g, " ");

    // 替换分号后添加换行
    formatted = formatted.replace(/;\s*/g, ";\n  ");

    // 替换左大括号后添加换行
    formatted = formatted.replace(/{\s*/g, "{\n  ");

    // 替换右大括号前添加换行
    formatted = formatted.replace(/\s*}/g, "\n}");

    // 处理嵌套选择器
    formatted = formatted.replace(/}\s*\./g, "}\n\n.");

    return formatted;
  }

  /**
   * 将CSS属性转换为Tailwind CSS格式
   * @param {string} css - 原始CSS代码
   * @returns {string} - 转换后的Tailwind CSS代码
   */
  function convertToTailwind(css) {
    // 提取CSS属性
    const properties = {};
    const regex = /(\w+-?\w*?):\s*([^;]+);/g;
    let match;

    while ((match = regex.exec(css)) !== null) {
      const property = match[1].trim();
      const value = match[2].trim();
      properties[property] = value;
    }

    // 转换为Tailwind类
    const tailwindClasses = [];
    // 处理背景色
    if (properties.background) {
      tailwindClasses.push(`bg-[${properties.background}]`);
    }

    // 处理圆角
    if (properties["border-radius"]) {
      tailwindClasses.push(`rounded-[${properties["border-radius"]}]`);
    }
    // 只有在没有字体大小时才处理宽高
    if (!properties["font-size"]) {
      // 处理宽度
      if (properties.width) {
        tailwindClasses.push(`w-[${properties.width}]`);
      }

      // 处理高度
      if (properties.height) {
        tailwindClasses.push(`h-[${properties.height}]`);
      }
    }

    // 处理字体系列
    // if (properties["font-family"]) {
    //   tailwindClasses.push(`font-[${properties["font-family"]}]`);
    // }

    // 处理字体粗细
    if (properties["font-weight"]) {
      const weightMap = {
        100: "thin",
        200: "extralight",
        300: "light",
        400: "normal",
        500: "medium",
        600: "semibold",
        700: "bold",
        800: "extrabold",
        900: "black",
      };
      const weight = weightMap[properties["font-weight"]];
      tailwindClasses.push(`font-${weight}`);
    }

    // 处理字体大小
    if (properties["font-size"]) {
      tailwindClasses.push(`text-[${properties["font-size"]}]`);
    }

    // 处理颜色
    if (properties.color) {
      tailwindClasses.push(`text-[${properties.color}]`);
    }

    // 处理行高
    // if (properties["line-height"]) {
    //   tailwindClasses.push(`leading-[${properties["line-height"]}]`);
    // }

    // 处理字间距
    // if (properties["letter-spacing"]) {
    //   tailwindClasses.push(`tracking-[${properties["letter-spacing"]}]`);
    // }

    // 处理文本对齐
    // if (properties["text-align"]) {
    //   tailwindClasses.push(`text-${properties["text-align"]}`);
    // }

    // 处理字体样式
    // if (properties["font-style"]) {
    //   if (properties["font-style"] === "italic") {
    //     tailwindClasses.push("italic");
    //   } else if (properties["font-style"] === "normal") {
    //     tailwindClasses.push("not-italic");
    //   }
    // }

    // 过滤掉空字符串并以换行方式返回
    return tailwindClasses.filter((c) => c).join("\n");
  }

  /**
   * 在页面上显示CSS弹窗
   * @param {string} css - 提取的CSS代码
   */
  function showCssPopup(css) {
    // 格式化CSS代码
    const formattedCss = formatCss(css);

    // 转换为Tailwind CSS
    const tailwindCss = convertToTailwind(css);

    // 检查是否已存在弹窗
    let existingPopup = document.getElementById("css-extractor-popup");
    if (existingPopup) {
      existingPopup.querySelector(".css-content").textContent = formattedCss;
      existingPopup.querySelector(".tailwind-content").textContent =
        tailwindCss;
      return;
    }

    // 添加动画和全局样式
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { transform: translateX(10px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      .tab-hover {
        transition: all 0.2s ease;
      }
      
      .tab-hover:hover {
        background-color: rgba(74, 144, 226, 0.1);
      }
    `;
    document.head.appendChild(styleElement);

    // 创建弹窗容器
    const popup = document.createElement("div");
    popup.id = "css-extractor-popup";
    popup.style.cssText = `
      position: fixed;
      top: 49px;
      right: 302px;
      background: white;
      border: none;
      border-radius: 12px;
      padding: 0;
      width: 380px;
      overflow: hidden;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      animation: fadeIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    `;

    // 创建标题栏
    const titleBar = document.createElement("div");
    titleBar.style.cssText = `
      background: linear-gradient(135deg, #4a90e2, #5a6acf);
      color: white;
      padding: 12px 18px;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      user-select: none;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `;
    titleBar.innerHTML =
      '<span style="display: flex; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>CSS提取器</span>';
    titleBar.className = "css-extractor-titlebar";

    // 创建按钮容器
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    // 创建回到原位按钮
    const resetPositionBtn = document.createElement("button");
    resetPositionBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>';
    resetPositionBtn.style.cssText = `
      border: none;
      background: rgba(255,255,255,0.25);
      color: white;
      border-radius: 6px;
      padding: 5px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    resetPositionBtn.title = "回到原位置";
    resetPositionBtn.onmouseover = () => {
      resetPositionBtn.style.backgroundColor = "rgba(255,255,255,0.4)";
      resetPositionBtn.style.transform = "scale(1.05)";
    };
    resetPositionBtn.onmouseout = () => {
      resetPositionBtn.style.backgroundColor = "rgba(255,255,255,0.25)";
      resetPositionBtn.style.transform = "scale(1)";
    };
    resetPositionBtn.onclick = (e) => {
      e.stopPropagation();
      popup.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
      popup.style.top = "49px";
      popup.style.right = "302px";
      popup.style.left = "auto";
      popup.style.bottom = "auto";

      // 添加一个轻微的动画效果
      popup.style.transform = "scale(1.03)";
      setTimeout(() => {
        popup.style.transform = "scale(1)";
      }, 300);
    };

    // 创建关闭按钮
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeBtn.style.cssText = `
      border: none;
      background: rgba(255,255,255,0.25);
      color: white;
      border-radius: 6px;
      padding: 5px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.background = "rgba(255,255,255,0.4)";
      closeBtn.style.transform = "translateY(-1px)";
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = "rgba(255,255,255,0.25)";
      closeBtn.style.transform = "translateY(0)";
    };
    closeBtn.onclick = () => {
      document.body.removeChild(popup);
    };

    // 将按钮添加到按钮容器
    buttonContainer.appendChild(resetPositionBtn);
    buttonContainer.appendChild(closeBtn);

    // 将按钮容器添加到标题栏
    titleBar.appendChild(buttonContainer);

    // 创建内容容器
    const tabContainer = document.createElement("div");
    tabContainer.style.cssText = `
      display: flex;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      background: #f8f9fa;
      padding: 0 10px;
    `;

    // 创建CSS标签
    const cssTab = document.createElement("div");
    cssTab.textContent = "CSS";
    cssTab.className = "css-tab tab-hover";
    cssTab.style.cssText = `
      padding: 12px 18px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      font-weight: 500;
      color: #666;
      font-size: 14px;
      transition: all 0.2s ease;
      border-radius: 6px 6px 0 0;
      margin: 6px 4px 0 4px;
    `;

    // 创建Tailwind标签
    const tailwindTab = document.createElement("div");
    tailwindTab.textContent = "Tailwind";
    tailwindTab.className = "tailwind-tab active-tab tab-hover";
    tailwindTab.style.cssText = `
      padding: 12px 18px;
      cursor: pointer;
      border-bottom: 2px solid #4a90e2;
      font-weight: 600;
      color: #4a90e2;
      font-size: 14px;
      transition: all 0.2s ease;
      background-color: rgba(74, 144, 226, 0.08);
      border-radius: 6px 6px 0 0;
      margin: 6px 4px 0 4px;
    `;

    // 添加标签到标签容器
    tabContainer.appendChild(cssTab);
    tabContainer.appendChild(tailwindTab);

    // 创建内容容器
    const contentContainer = document.createElement("div");
    contentContainer.style.cssText = `
      padding: 20px;
      max-height: none;
      overflow: auto;
      background: #f8f9fa;
      border-radius: 0 0 12px 12px;
    `;

    // 创建CSS内容区域
    const cssContent = document.createElement("pre");
    cssContent.className = "css-content";
    cssContent.style.cssText = `
      margin: 0;
      margin-bottom: 10px;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: 'SF Mono', Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
      display: none;
      padding: 16px;
      background-color: #ffffff;
      border-radius: 8px;
      animation: fadeIn 0.3s ease-in-out;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid rgba(0,0,0,0.05);
      cursor: pointer;
    `;
    cssContent.textContent = formattedCss;

    // 添加双击复制功能
    cssContent.ondblclick = (event) => {
      // 阻止默认行为，防止页面滚动
      event.preventDefault();

      // 获取内容并替换换行符为空格
      let contentToCopy = cssContent.textContent;
      contentToCopy = contentToCopy.replace(/\n/g, " ");

      // 复制到剪贴板
      navigator.clipboard.writeText(contentToCopy).then(
        () => {
          // 复制成功提示 - 添加临时样式变化
          const originalBackground = cssContent.style.backgroundColor;
          const originalColor = cssContent.style.color;

          cssContent.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
          cssContent.style.color = "rgba(16, 185, 129, 1)";

          setTimeout(() => {
            cssContent.style.backgroundColor = originalBackground;
            cssContent.style.color = originalColor;
          }, 1000);
        },
        (err) => {
          console.error("复制失败:", err);
          // 复制失败提示
          const originalBackground = cssContent.style.backgroundColor;

          cssContent.style.backgroundColor = "rgba(239, 68, 68, 0.1)";

          setTimeout(() => {
            cssContent.style.backgroundColor = originalBackground;
          }, 1000);
        }
      );
    };

    // 创建Tailwind内容区域
    const tailwindContent = document.createElement("pre");
    tailwindContent.className = "tailwind-content";
    tailwindContent.style.cssText = `
      margin: 0;
      margin-bottom: 10px;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: 'SF Mono', Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 14px;
      color: #2563eb;
      line-height: 1.8;
      display: block;
      padding: 16px;
      background-color: #f1f5f9;
      border-radius: 8px;
      animation: fadeIn 0.3s ease-in-out;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid rgba(0,0,0,0.05);
      cursor: pointer;
    `;
    tailwindContent.textContent = tailwindCss;

    // 添加双击复制功能
    tailwindContent.ondblclick = (event) => {
      // 阻止默认行为，防止页面滚动
      event.preventDefault();

      // 获取内容并替换换行符为空格
      let contentToCopy = tailwindContent.textContent;
      contentToCopy = contentToCopy.replace(/\n/g, " ");

      // 复制到剪贴板
      navigator.clipboard.writeText(contentToCopy).then(
        () => {
          // 复制成功提示 - 添加临时样式变化
          const originalBackground = tailwindContent.style.backgroundColor;
          const originalColor = tailwindContent.style.color;

          tailwindContent.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
          tailwindContent.style.color = "rgba(16, 185, 129, 1)";

          setTimeout(() => {
            tailwindContent.style.backgroundColor = originalBackground;
            tailwindContent.style.color = originalColor;
          }, 1000);
        },
        (err) => {
          console.error("复制失败:", err);
          // 复制失败提示
          const originalBackground = tailwindContent.style.backgroundColor;

          tailwindContent.style.backgroundColor = "rgba(239, 68, 68, 0.1)";

          setTimeout(() => {
            tailwindContent.style.backgroundColor = originalBackground;
          }, 1000);
        }
      );
    };

    // 添加双击复制提示
    const copyHintText = document.createElement("div");
    copyHintText.style.cssText = `
      font-size: 13px;
      color: #4a90e2;
      text-align: center;
      margin-bottom: 10px;
      font-style: italic;
      padding: 5px;
      border-radius: 4px;
      background-color: rgba(74, 144, 226, 0.08);
      transition: all 0.2s ease;
      cursor: help;
    `;
    copyHintText.innerHTML = "✨ 双击可复制内容 ✨";
    copyHintText.onmouseover = () => {
      copyHintText.style.backgroundColor = "rgba(74, 144, 226, 0.15)";
    };
    copyHintText.onmouseout = () => {
      copyHintText.style.backgroundColor = "rgba(74, 144, 226, 0.08)";
    };
    contentContainer.appendChild(copyHintText);

    // 添加标签切换功能
    cssTab.onclick = (event) => {
      // 阻止默认行为，防止页面滚动
      event.preventDefault();

      cssTab.style.borderBottom = "2px solid #4a90e2";
      cssTab.style.fontWeight = "600";
      cssTab.style.color = "#4a90e2";
      cssTab.style.backgroundColor = "rgba(74, 144, 226, 0.08)";
      tailwindTab.style.borderBottom = "2px solid transparent";
      tailwindTab.style.fontWeight = "500";
      tailwindTab.style.color = "#666";
      tailwindTab.style.backgroundColor = "transparent";
      cssContent.style.display = "block";
      tailwindContent.style.display = "none";

      // 添加动画效果
      cssContent.style.animation = "fadeIn 0.3s ease-in-out";
    };

    tailwindTab.onclick = (event) => {
      // 阻止默认行为，防止页面滚动
      event.preventDefault();

      tailwindTab.style.borderBottom = "2px solid #4a90e2";
      tailwindTab.style.fontWeight = "600";
      tailwindTab.style.color = "#4a90e2";
      tailwindTab.style.backgroundColor = "rgba(74, 144, 226, 0.08)";
      cssTab.style.borderBottom = "2px solid transparent";
      cssTab.style.fontWeight = "500";
      cssTab.style.color = "#666";
      cssTab.style.backgroundColor = "transparent";
      cssContent.style.display = "none";
      tailwindContent.style.display = "block";

      // 添加动画效果
      tailwindContent.style.animation = "fadeIn 0.3s ease-in-out";
    };

    // 组装弹窗
    contentContainer.appendChild(cssContent);
    contentContainer.appendChild(tailwindContent);

    popup.appendChild(titleBar);
    popup.appendChild(tabContainer);
    popup.appendChild(contentContainer);
    document.body.appendChild(popup);

    // 添加拖动功能 - 改进版本
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener("mousedown", (e) => {
      // 阻止默认行为，防止页面滚动
      e.preventDefault();

      isDragging = true;
      offsetX = e.clientX - popup.getBoundingClientRect().left;
      offsetY = e.clientY - popup.getBoundingClientRect().top;
      popup.style.transition = "none";
      popup.style.opacity = "0.92";
      popup.style.transform = "scale(1.01)";
      document.body.style.cursor = "grabbing";
      titleBar.style.cursor = "grabbing";
    });

    document.addEventListener(
      "mousemove",
      (e) => {
        if (isDragging) {
          // 阻止默认行为，防止页面滚动
          e.preventDefault();

          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;

          // 确保弹窗不会被拖出视口
          const maxX = window.innerWidth - popup.offsetWidth;
          const maxY = window.innerHeight - popup.offsetHeight;

          popup.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
          popup.style.right = "auto";
          popup.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
          popup.style.bottom = "auto";
        }
      },
      { passive: false }
    ); // 设置passive为false，允许阻止默认行为

    document.addEventListener(
      "mouseup",
      (e) => {
        if (isDragging) {
          // 阻止默认行为，防止页面滚动
          e.preventDefault();

          isDragging = false;
          popup.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
          popup.style.opacity = "1";
          popup.style.transform = "scale(1)";
          document.body.style.cursor = "default";
          titleBar.style.cursor = "move";
        }
      },
      { passive: false }
    ); // 设置passive为false，允许阻止默认行为

    // 添加窗口大小调整时的位置修正
    window.addEventListener("resize", () => {
      const rect = popup.getBoundingClientRect();
      const maxX = window.innerWidth - popup.offsetWidth;
      const maxY = window.innerHeight - popup.offsetHeight;

      if (rect.right > window.innerWidth) {
        popup.style.left = `${Math.max(0, maxX)}px`;
      }

      if (rect.bottom > window.innerHeight) {
        popup.style.top = `${Math.max(0, maxY)}px`;
      }
    });
  }

  /**
   * 防抖函数
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间
   * @param {Object} options - 配置选项
   * @returns {Function} - 防抖处理后的函数
   */
  function debounce(func, wait, options) {
    let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    if (typeof options === "object") {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      const args = lastArgs;
      const thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      const timeSinceLastCall = time - lastCallTime;
      const timeSinceLastInvoke = time - lastInvokeTime;
      const timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      const timeSinceLastCall = time - lastCallTime;
      const timeSinceLastInvoke = time - lastInvokeTime;

      return (
        lastCallTime === undefined ||
        timeSinceLastCall >= wait ||
        timeSinceLastCall < 0 ||
        (maxing && timeSinceLastInvoke >= maxWait)
      );
    }

    function timerExpired() {
      const time = Date.now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function debounced() {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  /**
   * 获取数组的最后一个元素
   * @param {Array} array - 输入数组
   * @returns {*} - 最后一个元素
   */
  function last(array) {
    const length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
  }

  /**
   * 去除字符串两端的空白
   * @param {string} str - 输入字符串
   * @returns {string} - 处理后的字符串
   */
  function trim(str) {
    return str ? str.trim() : "";
  }

  // 立即执行的函数，用于监视抽屉的打开状态
  (async () => {
    let obs = new MutationObserver(() => {
      // 获取所有抽屉元素
      const drawerList = document.querySelectorAll(
        "#detail_container .mu-drawer"
      );

      // 查找打开的抽屉
      let openDrawer = Array.from(drawerList).find((d) =>
        d.classList.contains("open")
      );
      // 如果找到新打开的抽屉，开始观察它
      if (openDrawer && ref.current !== openDrawer) {
        observeDrawer(openDrawer);
      }
    });

    // 观察整个文档body的变化
    obs.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
    });

    // 添加初始化提示
    console.log(
      "%c[CSS提取器]",
      "color:#3799a8; font-weight:bold;",
      "已初始化，等待蓝湖设计稿打开..."
    );
  })();
})();

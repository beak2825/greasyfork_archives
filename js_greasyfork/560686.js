// ==UserScript==
// @name         花瓣去水印Pro
// @version      2025-12-30
// @description  主要功能：1.显示花瓣真假PNG（原理：脚本通过给花瓣图片添加背景色，显示出透明PNG图片，透出背景色的即为透明PNG，非透明PNG就会被过滤掉） 2.通过自定义修改背景色，区分VIP素材和免费素材。 3.花瓣官方素材[vip素材]去水印（原理：通过ID获取高清预览图地址，直接替换为无水印高清源）更多描述可安装后查看
// @author       小张 | 个人博客：https://blog.z-l.top | 公众号“爱吃馍” | 设计导航站 ：https://dh.z-l.top | quicker账号昵称：星河城野❤
// @license      GPL-3.0
// @namespace    https://getquicker.net/User/Actions/388875-%E6%98%9F%E6%B2%B3%E5%9F%8E%E9%87%8E%E2%9D%A4
// @match        https://huaban.com/*
// @match        http://121.40.25.9:8080/register.html
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      gd.huaban.com
// @grant        GM_download
// @icon         https://st0.dancf.com/static/02/202306090204-51f4.png
// @require      https://cdn.tailwindcss.com
// @require      https://cdn.jsdelivr.net/gh/xiaolongmr/tampermonkey-scripts@10eb70fd822165082ce79edf445d7a90d48ade26/%E8%8A%B1%E7%93%A3%E5%8E%BB%E6%B0%B4%E5%8D%B0/%E8%8A%B1%E7%93%A3%E5%8E%BB%E6%B0%B4%E5%8D%B0Pro%E6%9B%B4%E6%96%B0%E6%8F%90%E7%A4%BA%E8%84%9A%E6%9C%AC.js
// @require      https://cdn.jsdelivr.net/gh/xiaolongmr/tampermonkey-scripts@09ee56b513ba1a42a4d0257c69a332d0a91aba77/%E7%BD%91%E7%AB%99%E6%B3%A8%E5%86%8C%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A1%A8%E5%8D%95%E4%BF%A1%E6%81%AF/%E7%BD%91%E7%AB%99%E6%B3%A8%E5%86%8C%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%A1%A8%E5%8D%95%E4%BF%A1%E6%81%AF.js
// @downloadURL https://update.greasyfork.org/scripts/560686/%E8%8A%B1%E7%93%A3%E5%8E%BB%E6%B0%B4%E5%8D%B0Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560686/%E8%8A%B1%E7%93%A3%E5%8E%BB%E6%B0%B4%E5%8D%B0Pro.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==================== 常量定义 ====================

  // 时间配置（毫秒）
  const TIMING = {
    debounceWatermark: 200, // 去水印操作的防抖延迟
    watermarkCheckInterval: 2000, // 水印检测间隔
    minProcessInterval: 500, // 最小处理间隔
    switchTransition: 1000, // 开关状态变化反馈时长
  };

  // DOM 选择器
  const SELECTORS = {
    // 花瓣网中的"查看大图"按钮图片
    imageButton:
      'img[data-button-name="查看大图"][src*="gd-hbimg-edge.huaban.com"]',
    // 图片查看器中的大图元素（带花瓣域名限制）
    imageViewer:
      'img.vYzIMzy2[alt="查看图片"][src*="gd-hbimg-edge.huaban.com"]',
    // 图片查看器容器内的大图元素（带容器ID和花瓣域名限制）
    imageViewerContainer:
      '#imageViewerWrapper img.vYzIMzy2[alt="查看图片"][src*="gd-hbimg-edge.huaban.com"]',
    // 简单图片查看器中的大图元素（不带域名限制）
    imageViewerSimple: 'img.vYzIMzy2[alt="查看图片"]',
  };

  // 默认配置
  const DEFAULT_CONFIG = {
    materialColor: "#ffe0e0",
    // 花瓣官方素材：淡红色
    userColor: "#ebffff",
    // 用户上传：粉蓝色
    enableCustom: true,
    // 启用自定义背景色
    enableRemoveWatermark: true,
    // 仅支持花瓣官方素材去水印功能，第三方素材无效
    enableDragDownload: true,
    // 启用拖拽下载功能
    enableRightClickDownload: true,
    // 启用右键下载功能
    enableMouseenterPreload: false,
    // 启用鼠标移入缩略图去水印功能（支持第三方，建议关闭）
  };

  // 配置字段映射（简化 getConfig/saveConfig）
  const CONFIG_KEYS = [
    "materialColor",
    "userColor",
    "enableCustom",
    "enableRemoveWatermark",
    "enableDragDownload",
    "enableRightClickDownload",
    "enableMouseenterPreload",
  ];

  // 状态变量：跟踪Ctrl+V/Cmd+V的使用状态
  let isImageSearchMode = false;


  // 高清URL缓存
  let hdUrlCache = new Map(); // 存储 ID 对应的高清 URL

  // ==================== 工具函数 ====================

  function debugLog() {
    /* no-op */
  }

  // 获取脚本版本号
  const getScriptVersion = () => {
    try {
      return GM_info?.script?.version || "未知";
    } catch (e) {
      return "未知";
    }
  };

  // 调试日志函数
  function debugLog() {
    /* no-op */
  }

  // 检查图片链接是否有效
  function checkImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // 颜色验证
  function isValidColor(color) {
    const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
    const rgbRegex =
      /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
    return hexRegex.test(color) || rgbRegex.test(color);
  }

  // 获取清理后的文件名（移除后缀参数，使用PNG扩展名）
  // 根据alt属性或span标签生成文件名，如果没有则使用默认文件名
  function getFileNameFromAlt(img) {
    // 仅使用alt属性生成文件名
    const altText = img.alt || "";

    // 如果alt属性有内容且不是默认的"查看图片"，则使用alt作为文件名
    if (altText && altText.trim() && altText !== "查看图片") {
      // 清理alt文本，移除特殊字符，只保留字母、数字、中文和空格
      let cleanAlt = altText.replace(/[^\w\u4e00-\u9fa5\s]/g, "").trim();

      // 如果清理后的文本不为空，则使用alt作为文件名
      if (cleanAlt) {
        // 限制文件名长度，避免过长
        if (cleanAlt.length > 40) {
          cleanAlt = cleanAlt.substring(0, 40);
        }

        // 添加.png扩展名
        return cleanAlt;
      }
    }

    // 如果alt属性无效，返回默认名称
    return "";
  }

  // 检查快捷键是否匹配
  const isHotkeyMatch = (e, hotkeyConfig) => {
    if (!hotkeyConfig) return false;
    const ctrlCmd = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;
    const key = e.key.toLowerCase();

    return (
      ctrlCmd === hotkeyConfig.ctrlCmd &&
      shift === hotkeyConfig.shift &&
      alt === hotkeyConfig.alt &&
      key === hotkeyConfig.key
    );
  };

  // ==================== 配置相关 ====================

  // 获取配置 - 使用配置字段映射简化代码
  function getConfig() {
    const result = {};
    CONFIG_KEYS.forEach((key) => {
      result[key] = GM_getValue(key, DEFAULT_CONFIG[key]);
    });
    return result;
  }

  // 获取快捷键配置
  const getHotkeysConfig = () => {
    const defaultHotkeys = {
      searchFocus: {
        ctrlCmd: true,
        shift: false,
        alt: false,
        key: "k",
        description: "定位到搜索框",
      },
      imageSearch: {
        ctrlCmd: true,
        shift: false,
        alt: false,
        key: "v",
        description: "以图搜索功能",
      },
      openSettings: {
        ctrlCmd: true,
        shift: false,
        alt: false,
        key: ",",
        description: "打开设置界面",
      },
    };
    return typeof GM_getValue === "function"
      ? GM_getValue("hotkeysConfig", defaultHotkeys)
      : defaultHotkeys;
  };

  // 保存配置 - 使用配置字段映射简化代码
  function saveConfig(config) {
    CONFIG_KEYS.forEach((key) => {
      if (key in config) {
        GM_setValue(key, config[key]);
      }
    });
  }

  // ==================== 样式应用 ====================

  // 应用样式
  function applyStyles() {
    const config = getConfig();

    // 移除旧样式
    const oldStyle = document.getElementById("huaban-bg-style");
    if (oldStyle) oldStyle.remove();

    // 添加动画效果CSS
    const style = document.createElement("style");
    style.id = "huaban-bg-style";
    style.textContent = `

            /* 花瓣素材 背景色 */
            .KKIUywzb[data-content-type="素材采集"] .transparent-img-bg {
                background-color: ${
                  config.enableCustom ? config.materialColor : "transparent"
                } !important;
                ${config.enableCustom ? "background-image:none!important;" : ""}
            }

            /* 用户上传背景色，非花瓣素材 */
            .KKIUywzb:not([data-content-type="素材采集"]) .transparent-img-bg,.transparent-img-black-bg,.transparent-img-bg {
                background-color: ${
                  config.enableCustom ? config.userColor : "transparent"
                } !important;
                ${config.enableCustom ? "background-image:none!important;" : ""}
            }
            
            /* 搜索框聚焦时的样式 - 仅在使用快捷键时触发 */
            [data-button-name="搜索框"].hb-search-focused:before {
                background: rgba(255, 40, 75, 0.3) !important;
            }
            

          /* antd弹出层样式宽度，花瓣采集框 */
           .ant-popover {
             min-width: 540px!important;
             }

          /* 下面是：花瓣添加到花瓣，画板列表元素 */
          .z8_k0U12 .JYXx0SF7 .__0nq08tOH {
              display: grid;
              grid-template-columns: repeat(2, minmax(0px, 1fr));
              height: auto!important;
              max-height: 300px;
          }
      
          /* 个人信息面板样式 */
          .user-profile { max-width: 800px; margin: 0 auto; }
          .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
          .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .profile-info h3 { margin: 0 0 10px; font-size: 24px; color: #333; }
          .profile-info .job { color: #666; margin: 0 0 5px; }
          .profile-info .joined { color: #999; font-size: 14px; }
          .profile-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; }
          .stat-item { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { display: block; font-size: 28px; font-weight: bold; color: #333; margin-bottom: 5px; }
          .stat-label { color: #666; font-size: 14px; }
          .loading { text-align: center; padding: 40px 0; color: #666; }
          .error-message { color: #dc3545; padding: 20px; text-align: center; background: #f8d7da; border-radius: 4px; }
        `;
    document.head.appendChild(style);
  }

  // ==================== 图片处理 ====================

  // 保存原始URL到图片元素的dataset中
  function saveOriginalUrl(img) {
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
      debugLog("保存原始URL:", img.dataset.originalSrc);
    }
    if (img.srcset && !img.dataset.originalSrcset) {
      img.dataset.originalSrcset = img.srcset;
      debugLog("保存原始srcset:", img.dataset.originalSrcset);
    }
  }

  // 恢复图片的原始URL
  function restoreOriginalUrl(img) {
    if (img.dataset.originalSrc) {
      debugLog("恢复原始URL:", img.dataset.originalSrc);
      img.src = img.dataset.originalSrc;
      delete img.dataset.originalSrc;
    }
    if (img.dataset.originalSrcset) {
      debugLog("恢复原始srcset:", img.dataset.originalSrcset);
      img.srcset = img.dataset.originalSrcset;
      delete img.dataset.originalSrcset;
    }
    // 移除处理标记
    img.removeAttribute("data-watermark-removed");
  }

  // 判断是否为官方自营素材
  function isOfficialMaterial(img) {
    if (!img) return false;

    // 检查img标签外的父元素是否有data-material-id属性
    // 向上查找最近的有data-material-id属性的父元素
    let parent = img.parentElement;
    while (parent) {
      if (parent.hasAttribute('data-material-id')) {
        return true;
      }
      // 避免无限循环，限制查找层级
      if (parent.classList.contains('brick') || parent.tagName === 'BODY') {
        break;
      }
      parent = parent.parentElement;
    }

    return false;
  }

  // --- 逻辑 1：提取 ID 并预读取高清地址 ---
  function preloadHD() {
    const sourceDiv = document.querySelector('.__2p__B98x, .AGmy_6yA'); //ID选择器 .__2p__B98x是老版本花瓣网的，.AGmy_6yA是新版本花瓣网
    if (!sourceDiv) return;

    const match = sourceDiv.innerText.match(/ID[:：]\s*(\d+)/i);
    if (match && match[1]) {
      const pinId = match[1];
      if (hdUrlCache.has(pinId)) return;

      hdUrlCache.set(pinId, "loading");

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://gd.huaban.com/editor/design?id=${pinId}`,
        onload: (res) => {
          const scriptMatch = res.responseText.match(/window\.__SSR_TEMPLATE\s*=\s*(\{[\s\S]*?\})(?:;|\s*<\/script>)/);
          if (scriptMatch) {
            try {
              const ssrData = JSON.parse(scriptMatch[1]);
              if (ssrData?.preview?.image_url) {
                const hdUrl = ssrData.preview.image_url;
                hdUrlCache.set(pinId, hdUrl);
                console.log(`[花瓣脚本] ID ${pinId} 高清源已获取`);
                executeReplacement(hdUrl); // 立即尝试替换
              }
            } catch(e) { console.error("解析JSON失败"); }
          }
        }
      });
    }
  }

  // --- 逻辑 2：执行 DOM 替换 ---
  function executeReplacement(url) {
    // 目标容器 1: 原始主展示区
    const container1 = document.querySelector('.OPWXbLYw , .Wa6mMsQV'); //图片详情选择器 .OPWXbLYw是老版本花瓣网，.Wa6mMsQV是新版本花瓣网
    // 目标容器 2: 新发现的弹出层/容器
    const container2 = document.querySelector('.vYzIMzy2 , .VFtkdxbR'); //图片详情弹出层选择器class

    const targets = [];
    if (container1) targets.push(container1.querySelector('img'));
    if (container2) {
      // 如果 vYzIMzy2 本身就是 img，直接添加；如果是 div，找内部 img
      if (container2.tagName === 'IMG') targets.push(container2);
      else targets.push(container2.querySelector('img'));
    }

    targets.forEach(img => {
      if (img && img.src !== url) {
        // 保存原始URL（如果还没有保存）
        if (!img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src;
        }
        img.src = url;
        // 核心：移除 srcset，防止浏览器根据分辨率自动切回压缩图
        img.removeAttribute('srcset');
        // 视觉反馈：绿色边框表示已成功替换
        // img.style.border = '2px solid #00FF00'; //把这个视觉反馈加到img的父级元素上
        img.parentElement.style.border = '2px solid #00FF00';
        // img.style.borderRadius = '20px';
        img.style.boxSizing = 'border-box';
        console.log('[花瓣脚本] 成功替换图片为高清图');
      }
    });
  }

  // --- 逻辑 3：状态检查循环 ---
  function checkState() {
    const sourceDiv = document.querySelector('.__2p__B98x, .AGmy_6yA');
    if (!sourceDiv) return;

    const match = sourceDiv.innerText.match(/ID[:：]\s*(\d+)/i);
    if (match) {
      const currentId = match[1];
      const cachedUrl = hdUrlCache.get(currentId);

      // 如果已经有缓存好的高清图，检查页面是否需要更新
      if (cachedUrl && cachedUrl !== "loading") {
        executeReplacement(cachedUrl);
      }
    }
  }

  // 实时监听图片变化
  function observeImageChanges() {
    // 监听图片src属性变化
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          const img = mutation.target;
          // 检查是否是我们关心的图片容器
          const container1 = document.querySelector('.OPWXbLYw , .Wa6mMsQV');
          const container2 = document.querySelector('.vYzIMzy2 , .VFtkdxbR');

          const targets = [];
          if (container1 && container1.contains(img)) targets.push(img);
          if (container2) {
            if (container2.tagName === 'IMG' && container2 === img) targets.push(img);
            else if (container2.contains(img)) targets.push(img);
          }

          if (targets.length > 0) {
            // 图片src发生变化，立即检查是否需要去水印
            const config = getConfig();
            if (config.enableRemoveWatermark) {
              checkState();
            }
          }
        }
      });
    });

    // 监听两个容器的图片变化
    const container1 = document.querySelector('.OPWXbLYw , .Wa6mMsQV');
    const container2 = document.querySelector('.vYzIMzy2 , .VFtkdxbR');

    if (container1) {
      const img1 = container1.querySelector('img');
      if (img1) {
        imageObserver.observe(img1, { attributes: true, attributeFilter: ['src'] });
      }
    }

    if (container2) {
      if (container2.tagName === 'IMG') {
        imageObserver.observe(container2, { attributes: true, attributeFilter: ['src'] });
      } else {
        const img2 = container2.querySelector('img');
        if (img2) {
          imageObserver.observe(img2, { attributes: true, attributeFilter: ['src'] });
        }
      }
    }

    // 同时监听容器的变化（当容器本身发生变化时）
    const containerObserver = new MutationObserver(() => {
      const config = getConfig();
      if (config.enableRemoveWatermark) {
        // 延迟一点执行，确保DOM更新完成
        setTimeout(() => {
          checkState();
        }, 100);
      }
    });

    // 监听可能包含图片的容器变化
    const containersToObserve = [
      document.querySelector('.OPWXbLYw , .Wa6mMsQV'),
      document.querySelector('.vYzIMzy2 , .VFtkdxbR')?.parentElement,
      document.body
    ].filter(Boolean);

    containersToObserve.forEach(container => {
      containerObserver.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
      });
    });
  }

  // 统一处理图片URL的去水印操作
  // 参数：
  // - url: 原始图片URL
  // - img: 图片元素，用于获取素材信息
  // - checkValidity: 是否检查URL有效性
  // 返回：Promise<string> - 处理后的图片URL
  async function processImageUrl(url, img, checkValidity = false) {
    const isOfficial = isOfficialMaterial(img);

    if (isOfficial) {
      // VIP素材：获取高清图URL
      return getHDImageUrl(img);
    } else {
      // 用户上传素材：处理img的src URL
      return extractImageUrlCore(url, false);
    }
  }

  // 获取VIP素材的高清图URL
  async function getHDImageUrl(img) {
    // 从img的父容器中找到data-material-id的值作为pin ID
    let pinId = null;
    let parent = img.parentElement;
    while (parent) {
      if (parent.hasAttribute('data-material-id')) {
        pinId = parent.getAttribute('data-material-id');
        break;
      }
      if (parent.classList.contains('brick') || parent.tagName === 'BODY') {
        break;
      }
      parent = parent.parentElement;
    }

    if (!pinId) {
      console.log('[花瓣脚本] 未找到data-material-id，使用原始URL');
      return extractImageUrlCore(img.src, true);
    }

    // 检查缓存中是否有高清图URL
    if (hdUrlCache.has(pinId) && hdUrlCache.get(pinId) !== "loading") {
      return hdUrlCache.get(pinId);
    }

    // 如果没有缓存，尝试获取高清图URL
    return new Promise((resolve) => {
      hdUrlCache.set(pinId, "loading");

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://gd.huaban.com/editor/design?id=${pinId}`,
        onload: (res) => {
          const scriptMatch = res.responseText.match(/window\.__SSR_TEMPLATE\s*=\s*(\{[\s\S]*?\})(?:;|\s*<\/script>)/);
          if (scriptMatch) {
            try {
              const ssrData = JSON.parse(scriptMatch[1]);
              if (ssrData?.preview?.image_url) {
                const hdUrl = ssrData.preview.image_url;
                hdUrlCache.set(pinId, hdUrl);
                console.log(`[花瓣脚本] ID ${pinId} 高清源已获取: ${hdUrl}`);
                resolve(hdUrl);
                return;
              }
            } catch(e) {
              console.error("解析JSON失败", e);
            }
          }
          // 如果获取失败，使用处理后的URL
          const fallbackUrl = extractImageUrlCore(img.src, true);
          console.log(`[花瓣脚本] 获取高清图失败，使用处理后的URL: ${fallbackUrl}`);
          resolve(fallbackUrl);
        },
        onerror: () => {
          // 如果请求失败，使用处理后的URL
          const fallbackUrl = extractImageUrlCore(img.src, true);
          console.log(`[花瓣脚本] 请求高清图失败，使用处理后的URL: ${fallbackUrl}`);
          resolve(fallbackUrl);
        }
      });
    });
  }

  // 从原脚本添加的URL处理核心函数
  function extractImageUrlCore(url, isOfficialMaterial) {
    // 分离URL和查询参数
    const [baseUrl, queryParams] = url.split("?");
    // 匹配花瓣图片URL中的后缀参数，如 _fw658webp
    const suffixRegex = /(_fw\d+webp)(\.webp)?$/i;
    // 匹配花瓣图片URL的域名和图片ID部分
    const watermarkRegex = /(https?:\/\/gd-hbimg-edge\.huaban\.com)\/([^\/?]+)/;

    let cleanUrl = url;
    
    if (suffixRegex.test(baseUrl) || watermarkRegex.test(baseUrl)) {
      // 去除后缀参数，得到基础URL
      const baseCleanUrl = baseUrl.replace(suffixRegex, "");
      
      // 如果是官方自营素材，尝试添加/small/前缀
      if (isOfficialMaterial) {
        let urlWithSmallPrefix;
        
        // 检查域名是否包含/small/，如果没有在域名后添加/small/前缀
        if (baseCleanUrl.includes("/small/")) {
          // 已经包含/small/前缀，直接使用
          urlWithSmallPrefix = baseCleanUrl;
        } else {
          // 没有包含/small/前缀，添加前缀
          urlWithSmallPrefix = watermarkRegex.test(baseCleanUrl) 
            ? baseCleanUrl.replace(watermarkRegex, "$1/small/$2") 
            : baseCleanUrl;
        }
        
        // 组合完整URL
        cleanUrl = queryParams 
          ? `${urlWithSmallPrefix}?${queryParams}` 
          : urlWithSmallPrefix;
      } else {
        // 非官方自营素材，仅去除后缀参数
        cleanUrl = queryParams 
          ? `${baseCleanUrl}?${queryParams}` 
          : baseCleanUrl;
      }
    }
    
    return cleanUrl;
  }

  // 获取所有需要处理的花瓣素材图片
  function getMaterialImages() {
    // 使用更精准的选择器，基于你提供的HTML元素
    const selectors = [
      // 缩略图：使用 data-button-name="查看大图" 属性
      SELECTORS.imageButton,
      // 大图查看器中的图片 - 优先级高，确保能捕获所有大图模式下的图片
      SELECTORS.imageViewerContainer,
      // 大图：使用 class="vYzIMzy2" 类名 + alt="查看图片" 属性
      SELECTORS.imageViewer,
      // 备用：花瓣素材图片
      '[data-material-type="套系素材"] img[src*="gd-hbimg-edge.huaban.com"]',
      // 备用：素材采集类型图片
      'img[src*="gd-hbimg-edge.huaban.com"][data-content-type="素材采集"]',
    ];

    return document.querySelectorAll(selectors.join(", "));
  }

  // 去水印功能：通过ID获取高清图并替换
  function processWatermark(force = false) {
    const config = getConfig();

    debugLog(
      "执行水印处理，enable:",
      config.enableRemoveWatermark,
      "force:",
      force
    );

    if (!config.enableRemoveWatermark) {
      // 如果功能已关闭，恢复原始URL
      const materialImages = getMaterialImages();
      materialImages.forEach((img) => {
        if (img.dataset.originalSrc) {
          restoreOriginalUrl(img);
        }
      });
      return;
    }

    // 触发预加载高清图
    preloadHD();
    // 检查并替换
    checkState();
  }

  // 处理单个图片元素
  function processImage(img) {
    if (img.dataset.processed) return;
    img.dataset.processed = "true";

    // 检查是否为VIP素材
    const isOfficial = isOfficialMaterial(img);
    if (isOfficial) {
      // 应用背景色
      const config = getConfig();
      if (config.enableCustom) {
        img.style.backgroundColor = config.materialColor;
      }
    }
  }

  // 处理图片容器
  function processContainer(container) {
    if (container.dataset.processed) return;
    container.dataset.processed = "true";

    // 检查容器内的图片是否为VIP素材
    const img = container.querySelector('img');
    if (img) {
      const isOfficial = isOfficialMaterial(img);
      if (isOfficial) {
        // 应用背景色
        const config = getConfig();
        if (config.enableCustom) {
          container.style.backgroundColor = config.materialColor;
        }
      }
    }
  }

  // 监听页面变化
  function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 处理新添加的图片元素
              const images = node.querySelectorAll
                ? node.querySelectorAll("img")
                : [];
              images.forEach((img) => processImage(img));

              // 处理新添加的图片容器
              const containers = node.querySelectorAll
                ? node.querySelectorAll('[data-type="pin"]')
                : [];
              containers.forEach((container) => processContainer(container));
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // ==================== 拦截器 ====================

  // 拦截AJAX请求
  function interceptAjaxRequests() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      if (url.includes("/pins/") && url.includes("/recommend")) {
        this.addEventListener("load", function () {
          try {
            const data = JSON.parse(this.responseText);
            if (data && data.pins) {
              data.pins.forEach((pin) => {
                if (pin.file && pin.file.key) {
                  preloadImage(pin.file.key);
                }
              });
            }
          } catch (e) {
            // 忽略解析错误
          }
        });
      }
      return originalOpen.call(this, method, url, ...args);
    };
  }

  // 拦截fetch请求
  function interceptFetchRequests() {
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0];
      if (typeof url === "string" && url.includes("/pins/") && url.includes("/recommend")) {
        return originalFetch.apply(this, args).then((response) => {
          response.clone().json().then((data) => {
            if (data && data.pins) {
              data.pins.forEach((pin) => {
                if (pin.file && pin.file.key) {
                  preloadImage(pin.file.key);
                }
              });
            }
          }).catch(() => {});
          return response;
        });
      }
      return originalFetch.apply(this, args);
    };
  }

  // 拦截图片点击
  function interceptImageClicks() {
    document.addEventListener("click", function (e) {
      const target = e.target;
      if (target.tagName === "IMG" && target.closest('[data-type="pin"]')) {
        const container = target.closest('[data-type="pin"]');
        if (container) {
          // 优先使用data-material-id，如果没有则使用data-id
          const pinId = container.getAttribute("data-material-id") || container.getAttribute("data-id");
          if (pinId) {
            // 预加载高清图
            preloadImage(pinId);
          }
        }
      }
    });
  }

  // 拦截拖拽和右键下载
  function interceptDragAndDownload() {
    const config = getConfig();

    // 鼠标移入预加载高清图片
    if (config.enableMouseenterPreload) {
      document.addEventListener("mouseenter", function (e) {
        const img = e.target;
        if (img.tagName !== "IMG") {
          return;
        }

        // 只处理花瓣图片
        if (!img.src.includes("gd-hbimg-edge.huaban.com")) {
          return;
        }

        // 如果已经处理过高清URL，直接返回
        if (img.dataset.hdProcessed) {
          return;
        }

        // 检查是否为官方自营素材（VIP素材）
        const isOfficial = isOfficialMaterial(img);
        if (!isOfficial) {
          console.log("[花瓣脚本] 检测到免费素材，跳过预加载高清URL");
          return;
        }

        console.log("[花瓣脚本] 检测到鼠标移入VIP素材，开始预加载高清URL:", img.src);

        // 异步获取高清URL并替换img.src
        (async () => {
          try {
            const hdUrl = await processImageUrl(img.src, img);
            if (hdUrl && hdUrl !== img.src) {
              // 保存原始URL
              if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
              }
              // 替换为高清URL
              img.src = hdUrl;
              img.dataset.hdProcessed = "true";
              console.log("[花瓣脚本] 预加载成功，高清URL已替换:", img.src, "→", hdUrl);
            }
          } catch (error) {
            console.error("[花瓣脚本] 预加载高清URL失败:", error);
          }
        })();

      }, true); // 使用捕获阶段，确保能捕获到事件
    }

    // 拖拽下载
    if (config.enableDragDownload) {
      document.addEventListener("dragstart", async function (e) {
        const img = e.target;
        if (img.tagName !== "IMG") {
          return;
        }

        // 只处理花瓣图片
        if (!img.src.includes("gd-hbimg-edge.huaban.com")) {
          return;
        }

        console.log("[花瓣脚本] 检测到拖拽开始:", img.src);

        // 检查是否为官方自营素材
        const isOfficial = isOfficialMaterial(img);
        console.log("[花瓣脚本] 是否为官方自营素材:", isOfficial);

        try {
          // 处理URL - 优先使用缓存的高清URL，如果没有缓存则使用原始URL
          let cleanUrl = img.src; // 默认使用当前img.src（可能已被预加载替换为高清URL）

          // 检查是否为官方自营素材
          const isOfficial = isOfficialMaterial(img);
          if (isOfficial) {
            // VIP素材：优先使用缓存的高清URL
            let pinId = null;
            let parent = img.parentElement;
            while (parent) {
              if (parent.hasAttribute('data-material-id')) {
                pinId = parent.getAttribute('data-material-id');
                break;
              }
              if (parent.classList.contains('brick') || parent.tagName === 'BODY') {
                break;
              }
              parent = parent.parentElement;
            }

            if (pinId && hdUrlCache.has(pinId) && hdUrlCache.get(pinId) !== "loading") {
              cleanUrl = hdUrlCache.get(pinId);
              console.log("[花瓣脚本] 使用缓存的高清URL:", cleanUrl);
            } else {
              console.log("[花瓣脚本] 未找到缓存的高清URL，使用当前img.src");
            }
          } else {
            // 用户上传素材：处理img的src URL
            cleanUrl = extractImageUrlCore(img.src, false);
          }

          console.log("[花瓣脚本] 处理后的下载URL:", img.src, "→", cleanUrl);

          // 设置拖拽数据 - 支持多种拖拽场景
          e.dataTransfer.effectAllowed = "copy";

          // 设置URI列表（支持大多数文件管理器）
          e.dataTransfer.setData("text/uri-list", cleanUrl);

          // 设置纯文本URL（备用）
          e.dataTransfer.setData("text/plain", cleanUrl);

          // 设置DownloadURL（支持某些浏览器和工具）
          const fileName = getFileNameFromAlt(img) + ".png";
          e.dataTransfer.setData(
            "DownloadURL",
            `image/png:${fileName}:${cleanUrl}`
          );

          console.log("[花瓣脚本] 已设置拖拽数据，文件名将保存为:", fileName);
        } catch (error) {
          console.error("[花瓣脚本] 拖拽处理失败:", error);
        }
      });
    }

    // 右键下载
    if (config.enableRightClickDownload) {
      document.addEventListener("contextmenu", async function (e) {
        const img = e.target;
        if (
          img.tagName === "IMG" &&
          (img.src.includes("gd-hbimg-edge.huaban.com") ||
           img.src.includes("hbimg.huaban.com") ||
           img.dataset.hdProcessed) // 支持已经预加载的高清图片
        ) {
          // 检查是否为需要处理的图片类型
          if (
            img.matches(SELECTORS.imageButton.split("[src*")[0]) ||
            img.closest("#imageViewerWrapper") ||
            img.matches(SELECTORS.imageViewerSimple) ||
            // 新增：支持预览图片（a标签内的img标签）
            (img.closest("a") &&
              img.closest("a").querySelector('span[style*="display: none"]')) ||
            // 新增：支持所有VIP素材图片（有data-material-id属性的图片）
            isOfficialMaterial(img) ||
            // 新增：支持所有花瓣图片（只要包含花瓣域名）
            img.src.includes("huaban.com")
          ) {
            // 立即阻止默认的右键菜单行为
            e.preventDefault();

            console.log("[花瓣脚本] 检测到右键菜单，使用GM_download下载:", img.src);

            // 检查是否为官方自营素材
            const isOfficial = isOfficialMaterial(img);
            console.log("[花瓣脚本] 是否为官方自营素材:", isOfficial);

            // 使用统一的URL处理函数
            const cleanUrl = await processImageUrl(img.src, img);
            console.log("[花瓣脚本] 处理后的下载URL:", img.src, "→", cleanUrl);

            // 使用GM_download API直接下载处理后的图片
            setTimeout(() => {
              try {
                // 使用alt属性作为文件名，如果没有alt则使用默认文件名
                const fileName = getFileNameFromAlt(img) + ".png";

                // 使用GM_download下载图片
                GM_download({
                  url: cleanUrl,
                  name: fileName,
                  onload: function () {
                    console.log("[花瓣脚本] 图片下载成功:", fileName);
                  },
                  onerror: function (error) {
                    console.error("[花瓣脚本] 图片下载失败:", error);
                    // 如果GM_download失败，尝试备用方案
                    fallbackDownload(cleanUrl, fileName, img);
                  },
                });
              } catch (error) {
                console.error("[花瓣脚本] GM_download调用失败:", error);
                // 备用下载方案
                fallbackDownload(cleanUrl, getFileNameFromAlt(img) + ".png", img);
              }
            }, 100);
          }
        }
      });
    }

    console.log("[花瓣脚本] 拖拽和右键下载拦截器已启动");
  }

  // ==================== 大图查看器处理 ====================

  // 处理大图查看器
  function handleImageViewer() {
    // 监听大图查看器的显示
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查是否是大图查看器
              if (node.classList && node.classList.contains("viewer")) {
                // 检查去水印开关是否开启
                const config = getConfig();
                if (config.enableRemoveWatermark) {
                  // 处理大图查看器中的图片
                  const images = node.querySelectorAll("img");
                  images.forEach((img) => {
                    // 优先从data-material-id获取pinId，如果没有则从URL提取
                    let pinId = null;
                    let parent = img.parentElement;
                    while (parent) {
                      if (parent.hasAttribute('data-material-id')) {
                        pinId = parent.getAttribute('data-material-id');
                        break;
                      }
                      if (parent.classList.contains('viewer') || parent.tagName === 'BODY') {
                        break;
                      }
                      parent = parent.parentElement;
                    }
                    
                    // 如果没找到data-material-id，尝试从URL提取
                    if (!pinId) {
                      pinId = extractPinIdFromUrl(img.src);
                    }
                    
                    if (pinId && hdUrlCache.has(pinId)) {
                      const hdUrl = hdUrlCache.get(pinId);
                      img.src = hdUrl;
                      img.dataset.originalSrc = img.src;
                    }
                  });
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // ==================== 素材页面处理 ====================

  // 在素材页面渲染网站列表
  function renderMaterialSitesOnSucaiPage() {
    if (!window.location.href.includes("/pages/sucai")) return;

    // 等待页面加载完成
    setTimeout(() => {
      const content = document.querySelector(".content");
      if (!content) return;

      // 创建网站列表容器
      const sitesContainer = document.createElement("div");
      sitesContainer.id = "material-sites-container";
      sitesContainer.style.cssText = `
        margin: 20px 0;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;

      sitesContainer.innerHTML = `
        <h3 style="margin: 0 0 15px 0; font-size: 18px;">🎨 素材下载网站推荐</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <a href="https://www.123rf.com/" target="_blank" style="display: block; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; text-decoration: none; color: white; transition: background 0.3s;">
            <strong>123RF</strong><br><small>国际素材网站</small>
          </a>
          <a href="https://www.shutterstock.com/" target="_blank" style="display: block; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; text-decoration: none; color: white; transition: background 0.3s;">
            <strong>Shutterstock</strong><br><small>专业图片素材</small>
          </a>
          <a href="https://www.istockphoto.com/" target="_blank" style="display: block; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; text-decoration: none; color: white; transition: background 0.3s;">
            <strong>iStock</strong><br><small>高质量素材库</small>
          </a>
          <a href="https://www.gettyimages.com/" target="_blank" style="display: block; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; text-decoration: none; color: white; transition: background 0.3s;">
            <strong>Getty Images</strong><br><small>知名图片代理</small>
          </a>
          <a href="https://www.vecteezy.com/" target="_blank" style="display: block; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; text-decoration: none; color: white; transition: background 0.3s;">
            <strong>Vecteezy</strong><br><small>免费矢量素材</small>
          </a>
          <a href="https://www.freepik.com/" target="_blank" style="display: block; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; text-decoration: none; color: white; transition: background 0.3s;">
            <strong>Freepik</strong><br><small>免费设计素材</small>
          </a>
        </div>
        <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">
          💡 提示：这些网站提供各种类型的设计素材，包括图片、矢量图、视频等，可以作为花瓣的补充来源。
        </p>
      `;

      // 添加hover效果
      sitesContainer.querySelectorAll("a").forEach(link => {
        link.addEventListener("mouseenter", () => {
          link.style.background = "rgba(255,255,255,0.2)";
        });
        link.addEventListener("mouseleave", () => {
          link.style.background = "rgba(255,255,255,0.1)";
        });
      });

      // 插入到页面顶部
      content.insertBefore(sitesContainer, content.firstChild);
    }, 2000);
  }

  // ==================== 工具函数 ====================

  // 获取下载文件名
  function getDownloadName(pinId, url) {
    const extension = url.split('.').pop().split('?')[0] || 'jpg';
    const timestamp = Date.now();
    return `huaban_${pinId}_${timestamp}.${extension}`;
  }

  // 从URL提取pinId
  function extractPinIdFromUrl(url) {
    const match = url.match(/\/pins\/(\d+)\//);
    return match ? match[1] : null;
  }

  // 预加载图片高清图
  function preloadImage(pinId) {
    if (hdUrlCache.has(pinId)) return;

    hdUrlCache.set(pinId, "loading");

    GM_xmlhttpRequest({
      method: "GET",
      url: `https://gd.huaban.com/editor/design?id=${pinId}`,
      onload: (res) => {
        const scriptMatch = res.responseText.match(/window\.__SSR_TEMPLATE\s*=\s*(\{[\s\S]*?\})(?:;|\s*<\/script>)/);
        if (scriptMatch) {
          try {
            const ssrData = JSON.parse(scriptMatch[1]);
            if (ssrData?.preview?.image_url) {
              const hdUrl = ssrData.preview.image_url;
              hdUrlCache.set(pinId, hdUrl);
              console.log(`[花瓣脚本] ID ${pinId} 高清源已获取`);
            }
          } catch(e) { console.error("解析JSON失败"); }
        }
      }
    });
  }

  // ==================== UI组件 ====================

  // 创建配置界面（左侧导航 / 右侧内容）
  function createConfigUI() {
    const config = getConfig();

    // 检查是否已存在配置面板
    const existingPanel = document.getElementById("huabanConfig");
    if (existingPanel) {
      existingPanel.remove();
      return;
    }

    // 创建主容器
    const container = document.createElement("div");
    container.id = "huabanConfig";
    container.className =
      "fixed inset-0 bg-black/30 flex items-center justify-center z-[999] backdrop-blur-sm";

    // 禁止页面滚动
    document.body.style.overflow = "hidden";

    // 创建卡片（更宽以容纳侧边栏）
    const card = document.createElement("div");
    // 固定高度布局，确保左侧导航与右侧内容高度一致
    card.className =
      "bg-white rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] w-[900px] h-[680px] max-w-[96vw] flex flex-col overflow-hidden";
    card.style.fontFamily =
      "'-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif'";

    // 侧边栏与主内容容器
    const bodyWrap = document.createElement("div");
    bodyWrap.className = "flex flex-1 min-h-0";

    const sidebar = document.createElement("div");
    // 侧栏采用纵向布局，底部显示版本号
    sidebar.className =
      "w-[150px] p-3 bg-slate-50 box-border flex flex-col justify-between overflow-hidden";

    // 左侧导航按钮
    const makeNavBtn = (id, text) => {
      const b = document.createElement("button");
      b.id = id;
      b.textContent = text;
      // 简约按钮样式：基础布局 + 简单过渡
      b.className =
        "block w-full text-left p-3 mb-2 rounded-lg bg-transparent cursor-pointer text-slate-700 text-sm transition-all duration-150 border-none";
      // 简约hover效果
      b.addEventListener("mouseenter", () => {
        if (!b.dataset.active) b.style.backgroundColor = "#e9edf3ff";
      });
      b.addEventListener("mouseleave", () => {
        if (!b.dataset.active) b.style.backgroundColor = "transparent";
      });
      return b;
    };

    // 切换激活态样式
    function setActive(activeId) {
      const btns = sidebar.querySelectorAll('button[id^="cfg-tab-"]');
      btns.forEach((b) => {
        if (b.id === activeId) {
          b.dataset.active = "1";
          // 极简选中状态：仅保留背景色和文字颜色
          b.style.backgroundColor = "rgb(255, 255, 255)";
          b.style.color = "rgb(255, 40, 75)";
        } else {
          delete b.dataset.active;
          b.style.backgroundColor = "transparent";
          b.style.color = "rgb(51, 65, 85)";
        }
      });
    }

    const navSettings = makeNavBtn("cfg-tab-settings", "⚙️ 设置选项");
    const navUsage = makeNavBtn("cfg-tab-usage", "📖 使用说明");
    const navUpdate = makeNavBtn("cfg-tab-update", "📝 更新记录");
    const navTwikoo = makeNavBtn("cfg-tab-twikoo", "🤝 网友互助");
    const navThanks = makeNavBtn("cfg-tab-thanks", "🙏 致谢名单");
    const navUserProfile = makeNavBtn("cfg-tab-user", "👤 个人信息");

    const navTop = document.createElement("div");
    navTop.className = "flex flex-col gap-2";
    navTop.appendChild(navSettings);
    navTop.appendChild(navUsage);
    navTop.appendChild(navUpdate);
    navTop.appendChild(navTwikoo);
    navTop.appendChild(navThanks);
    navTop.appendChild(navUserProfile);
    sidebar.appendChild(navTop);

    // 版本信息放在侧栏底部，参考示例布局
    const versionEl = document.createElement("div");
    versionEl.className = "text-xs text-slate-400 p-3";
    versionEl.textContent = `版本 v${getScriptVersion()}`;
    sidebar.appendChild(versionEl);

    const main = document.createElement("div");
    main.id = "hb-config-main-settings"; // 默认显示设置面板，所以默认id为settings
    // 主区使用滚动容器以适配内嵌大型面板（如历史、聊天）
    main.className = "flex-1 m-4 overflow-auto min-h-0 box-border";

    bodyWrap.appendChild(sidebar);
    bodyWrap.appendChild(main);

    // 添加到卡片（不再渲染顶部 header）
    card.appendChild(bodyWrap);
    container.appendChild(card);

    // 添加到页面
    document.body.appendChild(container);

    // 导航交互：渲染不同的面板
    function renderSettings() {
      // 设置主容器的 id，包含所属分类
      main.id = "hb-config-main-settings";
      // 重置所有可能受致谢名单影响的样式
      main.style.padding = "16px";
      main.style.margin = "0";
      main.style.background = "none";
      main.style.borderRadius = "0";
      main.innerHTML = "";
      // 将原来的 content 区域内容渲染到 main
      main.innerHTML = "";
      // switchesSection, colorSettings, actions 会被插入后
      main.appendChild(switchesSection);
      main.innerHTML += colorSettings;
      main.appendChild(hotkeysSettings);
      main.appendChild(actions);

      // 初始化时根据开关状态显示或隐藏颜色选择器
      const colorSettingsContainer = document.getElementById(
        "colorSettingsContainer"
      );
      const enableCustomSwitch = document.getElementById("enableCustomSwitch");
      if (colorSettingsContainer && enableCustomSwitch) {
        colorSettingsContainer.style.display = enableCustomSwitch.checked
          ? "block"
          : "none";
      }
    }

    // 更新记录在主区域嵌入 Feishu（iframe），若无法显示提供外链
    function renderUpdate() {
      // 设置主容器的 id，包含所属分类
      main.id = "hb-config-main-update";
      main.innerHTML = "";
      // 重置所有可能受致谢名单影响的样式
      main.style.padding = "0";
      main.style.margin = "0";
      main.style.background = "none";
      main.style.borderRadius = "0";
      main.style.position = "relative";
      const feishuUrl =
        "https://ai-chimo.feishu.cn/wiki/EcTAwKw2bifqGjku9pzccaVcnId";
      const iframe = document.createElement("iframe");
      iframe.src = feishuUrl;
      iframe.className = "w-full h-full min-h-[480px] border-0 rounded-lg";
      iframe.allow = "fullscreen; clipboard-write";
      const fallback = document.createElement("div");
      fallback.className =
        "text-sm text-center absolute w-full bottom-0 left-1/2 -translate-x-1/2 no-underline bg-white px-4 py-2 rounded shadow-md";
      fallback.innerHTML = `若嵌入内容无法显示，请 <a href="${feishuUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500">在新标签页打开更新记录</a>（飞书文档）`;
      main.appendChild(iframe);
      main.appendChild(fallback);
    }

    // 使用说明在主区域嵌入 Feishu（iframe），若无法显示提供外链
    function renderUsage() {
      // 设置主容器的 id，包含所属分类
      main.id = "hb-config-main-usage";
      main.innerHTML = "";
      // 重置所有可能受致谢名单影响的样式
      main.style.padding = "0";
      main.style.margin = "0";
      main.style.background = "none";
      main.style.borderRadius = "0";
      main.style.position = "relative";
      const feishuUrl =
        "https://ai-chimo.feishu.cn/wiki/E9SEwhoMmiv2CkkC1VgcAbRTnW3";
      const iframe = document.createElement("iframe");
      iframe.src = feishuUrl;
      iframe.className = "w-full h-full min-h-[480px] border-0 rounded-lg";
      iframe.allow = "fullscreen; clipboard-write";
      const fallback = document.createElement("div");
      fallback.className =
        "text-sm text-center absolute w-full bottom-0 left-1/2 -translate-x-1/2 no-underline bg-white px-4 py-2 rounded shadow-md";
      fallback.innerHTML = `若嵌入内容无法显示，请 <a href="${feishuUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500">在新标签页打开使用说明</a>（飞书文档）`;
      main.appendChild(iframe);
      main.appendChild(fallback);
    }

    // 导航按钮事件（同时设置激活态）
    navSettings.addEventListener("click", () => {
      setActive("cfg-tab-settings");
      renderSettings();
    });
    navUsage.addEventListener("click", () => {
      setActive("cfg-tab-usage");
      renderUsage();
    });
    navUpdate.addEventListener("click", () => {
      setActive("cfg-tab-update");
      renderUpdate();
    });

    //个人信息
    function renderUserProfile() {
      // 使用外部作用域中已经定义好的main变量
      if (!main) return;

      // 设置主容器的 id，包含所属分类
      main.id = "hb-config-main-user";
      main.innerHTML =
        '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 加载个人信息中...</div>';
      // 重置所有可能受致谢名单影响的样式
      main.style.padding = "16px";
      main.style.margin = "0";
      main.style.background = "none";
      main.style.borderRadius = "0";
      main.style.position = "relative";

      fetch("https://huaban.com/v3/users/me")
        .then((response) => response.json())
        .then((data) => {
          const createdAt = new Date(
            data.created_at * 1000
          ).toLocaleDateString();
          main.innerHTML = `
                <div class="user-profile">
                    <div class="profile-header">
                        <img src="${data.avatar.url}" alt="${
            data.username
          }" class="avatar">
                        <div class="profile-info">
                            <h3>${data.username}</h3>
                            <p class="job">${
                              data.profile.job || "未填写职业信息"
                            }</p>
                            <p class="joined">注册时间: ${createdAt}</p>
                        </div>
                    </div>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-value">${data.board_count}</span>
                            <span class="stat-label">画板</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${data.pin_count}</span>
                            <span class="stat-label">采集</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${
                              data.follower_count
                            }</span>
                            <span class="stat-label">粉丝</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${
                              data.following_count
                            }</span>
                            <span class="stat-label">关注</span>
                        </div>
                    </div>
            </div>
        `;
        })
        .catch((error) => {
          main.innerHTML =
            '<div class="error-message"><i class="fa fa-exclamation-circle"></i> 获取个人信息失败，请稍后重试</div>';
          console.error("获取花瓣用户信息失败:可能未登录", error);
        });
    }
    // 在主区域渲染致谢名单（iframe）
    function renderThanksPanel() {
      // 设置主容器的 id，包含所属分类
      main.id = "hb-config-main-thanks";
      main.style.padding = "0px";
      main.style.margin = "16px";
      main.style.background =
        "linear-gradient(rgb(255, 198, 196), rgba(255, 198, 196, 0.95) 50%, rgb(255, 255, 255) 90%)";
      main.style.borderRadius = "6px";
      main.innerHTML = "";
      main.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src =
        "https://xiaolongmr.github.io/tampermonkey-scripts/%E8%8A%B1%E7%93%A3%E5%8E%BB%E6%B0%B4%E5%8D%B0/%E8%87%B4%E8%B0%A2%E5%90%8D%E5%8D%95.html";
      iframe.className =
        "block mx-auto w-[420px] h-[585px] border-0 rounded-lg";
      main.appendChild(iframe);
    }

    // 重新创建修改后的renderTwikooPanel函数
    function renderTwikooPanel() {
      // 设置主容器的 id，包含所属分类
      main.id = "hb-config-main-twikoo";
      // 重置所有可能受致谢名单影响的样式
      main.style.padding = "16px";
      main.style.margin = "0";
      main.style.background = "none";
      main.style.borderRadius = "0";
      main.innerHTML = "";
      const title = document.createElement("div");
      title.className = "flex items-center justify-between mb-3";
      title.innerHTML = `<h3 class="m-0 text-base text-slate-700">网友互助区</h3><div class="text-xs text-slate-400">通过 Twikoo 聊天与其他用户交流</div>`;
      const wrapper = document.createElement("div");
      wrapper.className = "flex-1 flex flex-col gap-3 h-full min-h-0";

      // 创建说明文字区域
      const materialSitesSection = document.createElement("div");
      materialSitesSection.className = "bg-white rounded-lg p-3 box-border";
      const materialSitesTitle = document.createElement("div");
      const materialSitesList = document.createElement("div");
      materialSitesList.className = "text-sm text-slate-600 leading-relaxed";
      materialSitesList.innerHTML =
        "公众号文章开了广告，朋友们有空的话每天可点点广告，收益用于购买素材解析网站的积分，帮使用脚本的朋友免费下载素材，可下载的素材<a href='https://huaban.com/pages/sucai' target='_blank' class='text-blue-500 hover:underline'>点我进入查看</a>，复制你要下的素材网址，在下方或公众号任意文章下评论，我看到会帮忙下载的，积分用完为止！";
      materialSitesSection.appendChild(materialSitesTitle);
      materialSitesSection.appendChild(materialSitesList);

      const commentWrap = document.createElement("div");
      commentWrap.id = "tcomment";
      commentWrap.className =
        "flex-1 min-h-0 overflow-auto bg-white rounded-lg p-3 box-border";
      wrapper.appendChild(materialSitesSection);
      wrapper.appendChild(commentWrap);
      main.appendChild(title);
      main.appendChild(wrapper);

      // 动态加载Twikoo并初始化（若未加载）
      try {
        if (!document.querySelector('link[href*="twikoo"]')) {
          const twikooCss = document.createElement("link");
          twikooCss.rel = "stylesheet";
          twikooCss.href =
            "https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.css";
          document.head.appendChild(twikooCss);
        }
        if (typeof twikoo === "undefined") {
          const twikooScript = document.createElement("script");
          twikooScript.src =
            "https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.nocss.js";
          twikooScript.onload = function () {
            try {
              if (typeof twikoo !== "undefined") {
                twikoo.init({
                  envId: "https://twikookaishu.z-l.top",
                  el: "#tcomment",
                  path: "/huaban-helper-all",
                });
              }
            } catch (e) {
              console.error(e);
            }
          };
          document.head.appendChild(twikooScript);
        } else {
          try {
            twikoo.init({
              envId: "https://twikookaishu.z-l.top",
              el: "#tcomment",
              path: "/huaban-helper-all",
            });
          } catch (e) {}
        }
      } catch (e) {
        console.error("初始化 Twikoo 失败", e);
      }
    }

    navTwikoo.addEventListener("click", (e) => {
      e.preventDefault();
      setActive("cfg-tab-twikoo");
      renderTwikooPanel();
    });

    navThanks.addEventListener("click", (e) => {
      e.preventDefault();
      setActive("cfg-tab-thanks");
      renderThanksPanel();
    });
    navUserProfile.addEventListener("click", (e) => {
      e.preventDefault();
      setActive("cfg-tab-user");
      renderUserProfile();
    });

    // 初始显示设置面板并设置激活态
    // NOTE: moved below after switchesSection/colorSettings/actions are created
    const showThanksList = () => {
      try {
        // 创建模态框
        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] backdrop-blur-sm";

        // 禁止页面滚动
        document.body.style.overflow = "hidden";

        // 创建容器
        const container = document.createElement("div");
        container.className =
          "relative w-[420px] h-[585px] max-w-[95vw] max-h-[90vh] overflow-hidden";

        // 创建iframe嵌套致谢名单HTML文件
        const iframe = document.createElement("iframe");
        iframe.src =
          "https://xiaolongmr.github.io/tampermonkey-scripts/%E8%8A%B1%E7%93%A3%E5%8E%BB%E6%B0%B4%E5%8D%B0/%E8%87%B4%E8%B0%A2%E5%90%8D%E5%8D%95.html";
        iframe.className =
          "absolute inset-0 w-full h-full border-0 outline-none";
        iframe.allow = "autoplay; clipboard-write";
        iframe.frameBorder = "0";

        // 创建关闭按钮
        const closeButton = document.createElement("div");
        closeButton.className =
          "absolute right-2.5 top-2.5 w-7 h-7 bg-black/10 rounded-full flex items-center justify-center select-none z-10 cursor-pointer";
        // 创建SVG关闭图标
        const closeIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        closeIcon.setAttribute("width", "16");
        closeIcon.setAttribute("height", "16");
        closeIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        closeIcon.setAttribute("viewBox", "0 0 1024 1024");
        closeIcon.setAttribute("fill", "white");

        // 创建路径
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute(
          "d",
          "M198.1 267.7l75.4-75.4 576.3 576.3-75.4 75.4-576.3-576.3zm576.4-69.3l75.4 75.4-580.7 580.8-75.4-75.4 580.7-580.8z"
        );

        // 组装SVG图标
        closeIcon.appendChild(path);
        closeButton.appendChild(closeIcon);
        closeButton.addEventListener("click", () => {
          document.body.removeChild(modal);
          // 恢复页面滚动
          document.body.style.overflow = "auto";
        });
        closeButton.addEventListener("mouseenter", () => {
          closeButton.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        });
        closeButton.addEventListener("mouseleave", () => {
          closeButton.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        });

        // 组装模态框
        container.appendChild(iframe);
        container.appendChild(closeButton);
        modal.appendChild(container);

        // 点击模态框背景关闭
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            document.body.removeChild(modal);
            // 恢复页面滚动
            document.body.style.overflow = "auto";
          }
        });

        // 添加到文档
        document.body.appendChild(modal);
      } catch (error) {
        console.error("显示致谢名单失败:", error);
        alert("无法加载致谢名单，请稍后再试");
      }
    };

    // 延迟添加事件监听器，确保DOM已渲染
    setTimeout(() => {
      const thanksListLink = document.getElementById("thanksListLink");
      if (thanksListLink) {
        thanksListLink.addEventListener("click", (e) => {
          e.preventDefault();
          showThanksList();
        });
      }
    }, 0);

    // 卡片内容
    const content = main;

    // 启用开关区域 - 使用网格布局
    const switchesSection = document.createElement("div");
    switchesSection.className = "mb-4 grid grid-cols-2 gap-3";

    // 自定义背景色开关
    const enableCustomSection = document.createElement("div");
    enableCustomSection.className =
      "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200";

    const enableCustomHTML = `
            <span class="text-sm font-medium text-slate-700 flex items-center">
                开启图片自定义背景色
            </span>
            <div class="relative w-10 h-5 cursor-pointer" id="enableCustomContainer">
                <input type="checkbox" id="enableCustomSwitch" ${
                  config.enableCustom ? "checked" : ""
                }
                       class="absolute inset-0 opacity-0 cursor-pointer z-30">
                <span class="absolute inset-0 rounded-full transition-colors duration-200 z-10" style="background: ${config.enableCustom ? '#3b82f6' : '#e2e8f0'}"></span>
                <span class="absolute w-4 h-4 top-0.5 bg-white rounded-full transition-all duration-200 shadow-sm z-20" id="enableCustomThumb" style="left: ${config.enableCustom ? '22px' : '2px'}"></span>
            </div>
        `;

    enableCustomSection.innerHTML = enableCustomHTML;

    // 去水印功能开关
    const enableWatermarkSection = document.createElement("div");
    enableWatermarkSection.className =
      "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200";

    const enableWatermarkHTML = `
            <span class="text-sm font-medium text-slate-700 flex items-center">花瓣 vip 素材去水印
            </span>
            <div class="relative w-10 h-5 cursor-pointer" id="enableWatermarkContainer">
                <input type="checkbox" id="enableWatermarkSwitch" ${
                  config.enableRemoveWatermark ? "checked" : ""
                }
                       class="absolute inset-0 opacity-0 cursor-pointer z-30">
                <span class="absolute inset-0 rounded-full transition-colors duration-200 z-10" style="background: ${config.enableRemoveWatermark ? '#3b82f6' : '#e2e8f0'}"></span>
                <span class="absolute w-4 h-4 top-0.5 bg-white rounded-full transition-all duration-200 shadow-sm z-20" id="enableWatermarkThumb" style="left: ${config.enableRemoveWatermark ? '22px' : '2px'}"></span>
            </div>
        `;

    enableWatermarkSection.innerHTML = enableWatermarkHTML;

    // 拖拽下载功能开关
    const enableDragSection = document.createElement("div");
    enableDragSection.className =
      "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200";

    const enableDragHTML = `
            <span class="text-sm font-medium text-slate-700 flex items-center">拖拽下载图片<span class="text-xs text-slate-400 ml-1">（适配资源管理器/<a href="https://wwz.lanzouq.com/iyUTy1zt2b4d" target="_blank" class="text-blue-500 no-underline" title="点击下载PureRef">PureRef</a>）</span>
            </span>
            <div class="relative w-10 h-5 cursor-pointer" id="enableDragContainer">
                <input type="checkbox" id="enableDragSwitch" ${
                  config.enableDragDownload ? "checked" : ""
                }
                       class="absolute inset-0 opacity-0 cursor-pointer z-30">
                <span class="absolute inset-0 rounded-full transition-colors duration-200 z-10" style="background: ${config.enableDragDownload ? '#3b82f6' : '#e2e8f0'}"></span>
                <span class="absolute w-4 h-4 top-0.5 bg-white rounded-full transition-all duration-200 shadow-sm z-20" id="enableDragThumb" style="left: ${config.enableDragDownload ? '22px' : '2px'}"></span>
            </div>
        `;

    enableDragSection.innerHTML = enableDragHTML;

    // 右键下载功能开关
    const enableRightClickSection = document.createElement("div");
    enableRightClickSection.className =
      "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200";

    const enableRightClickHTML = `
            <span class="text-sm font-medium text-slate-700 flex items-center">右键下载图片<span class="text-xs text-slate-400 ml-1">（修正乱码名称）</span>
            </span>
            <div class="relative w-10 h-5 cursor-pointer" id="enableRightClickContainer">
                <input type="checkbox" id="enableRightClickSwitch" ${
                  config.enableRightClickDownload ? "checked" : ""
                }
                       class="absolute inset-0 opacity-0 cursor-pointer z-30">
                <span class="absolute inset-0 rounded-full transition-colors duration-200 z-10" style="background: ${config.enableRightClickDownload ? '#3b82f6' : '#e2e8f0'}"></span>
                <span class="absolute w-4 h-4 top-0.5 bg-white rounded-full transition-all duration-200 shadow-sm z-20" id="enableRightClickThumb" style="left: ${config.enableRightClickDownload ? '22px' : '2px'}"></span>
            </div>
        `;

    enableRightClickSection.innerHTML = enableRightClickHTML;

    // 鼠标移入预加载开关
    const enableMouseenterSection = document.createElement("div");
    enableMouseenterSection.className =
      "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200";

    const enableMouseenterHTML = `
            <span class="text-sm font-medium text-slate-700 flex items-center">鼠标移入缩略图去水印<span class="text-xs text-slate-400 ml-1">（建议关闭）</span>
            </span>
            <div class="relative w-10 h-5 cursor-pointer" id="enableMouseenterContainer">
                <input type="checkbox" id="enableMouseenterSwitch" ${
                  config.enableMouseenterPreload ? "checked" : ""
                }
                       class="absolute inset-0 opacity-0 cursor-pointer z-30">
                <span class="absolute inset-0 rounded-full transition-colors duration-200 z-10" style="background: ${config.enableMouseenterPreload ? '#3b82f6' : '#e2e8f0'}"></span>
                <span class="absolute w-4 h-4 top-0.5 bg-white rounded-full transition-all duration-200 shadow-sm z-20" id="enableMouseenterThumb" style="left: ${config.enableMouseenterPreload ? '22px' : '2px'}"></span>
            </div>
        `;

    enableMouseenterSection.innerHTML = enableMouseenterHTML;

    // 组装开关区域
    switchesSection.appendChild(enableCustomSection);
    switchesSection.appendChild(enableWatermarkSection);
    switchesSection.appendChild(enableDragSection);
    switchesSection.appendChild(enableRightClickSection);
    switchesSection.appendChild(enableMouseenterSection);

    const colorSettings = `
            <!-- 素材背景颜色设置容器 -->
            <div id="colorSettingsContainer" class="mb-3">
            <div class="text-sm font-semibold text-slate-800 mb-2">
                🎨 背景颜色
            </div>
            <div class="grid grid-cols-2 gap-3">
            <!-- 花瓣素材颜色 -->
            <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div class="text-xs font-medium text-slate-700">
                    花瓣素材
                </div>
                <div class="w-7 h-7 rounded border border-slate-200 cursor-pointer" id="materialPreview" style="background: ${config.materialColor}">
                    <input type="color" id="materialPicker" value="${config.materialColor}" class="w-full h-full opacity-0 cursor-pointer">
                </div>
            </div>

            <!-- 用户上传颜色 -->
            <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div class="text-xs font-medium text-slate-700">
                    用户上传
                </div>
                <div class="w-7 h-7 rounded border border-slate-200 cursor-pointer" id="userPreview" style="background: ${config.userColor}">
                    <input type="color" id="userPicker" value="${config.userColor}" class="w-full h-full opacity-0 cursor-pointer">
                </div>
            </div>
            </div>
        `;

    // 快捷键设置区域
    const hotkeysSettings = document.createElement("div");
    hotkeysSettings.className = "mb-4";
    hotkeysSettings.innerHTML = `
        <div style="margin-bottom: 10px;">
            <div style="
                font-size: 13px;
                color: #334155;
                font-weight: 600;
                margin-bottom: 6px;
            ">
                ⌨️ 快捷键设置
            </div>
        </div>`;

    // 获取当前快捷键配置
    const hotkeysConfig = getHotkeysConfig();

    // 快捷键项目列表
    const hotkeyItems = [
      { id: "searchFocus", label: "定位到搜索框", defaultKey: "k" },
      { id: "imageSearch", label: "以图搜索功能", defaultKey: "v" },
      { id: "openSettings", label: "打开设置界面", defaultKey: "," },
    ];

    // 创建网格容器
    const hotkeysGrid = document.createElement("div");
    hotkeysGrid.className = "grid grid-cols-2 gap-3";

    // 创建每个快捷键设置项
    hotkeyItems.forEach((item) => {
      const hotkeyItem = document.createElement("div");
      hotkeyItem.className =
        "p-2 bg-slate-50 rounded-lg border border-slate-200";

      const hotkeyConfig = hotkeysConfig[item.id] || {
        ctrlCmd: true,
        shift: false,
        alt: false,
        key: item.defaultKey,
      };

      hotkeyItem.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 4px;
            "><span style="font-size: 12px; color: #334155; font-weight: 500;">${
              item.label
            }</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <div style="flex: 1;">
                    <input type="text" id="hotkey-${item.id}"
                           value="${hotkeyConfig.ctrlCmd ? "Ctrl+" : ""}${
        hotkeyConfig.shift ? "Shift+" : ""
      }${hotkeyConfig.alt ? "Alt+" : ""}${hotkeyConfig.key.toUpperCase()}"
                           style="
                               width: 100%;
                               padding: 6px 8px;
                               border: 1px solid #e2e8f0;
                               border-radius: 4px;
                               font-size: 12px;
                               color: #334155;
                               font-family: monospace;
                           "
                           data-hotkey-id="${item.id}"
                           readonly>
                </div>
                <button type="button" id="reset-hotkey-${item.id}"
                        style="
                            padding: 4px 8px;
                            background: #f8fafc;
                            color: #64748b;
                            border: 1px solid #e2e8f0;
                            border-radius: 4px;
                            font-size: 11px;
                            cursor: pointer;
                        ">
                    重置
                </button>
            </div>
        `;

      hotkeysGrid.appendChild(hotkeyItem);
    });

    // 将网格容器添加到快捷键设置区域
    hotkeysSettings.appendChild(hotkeysGrid);

    // 操作按钮
    const actions = document.createElement("div");
    actions.className = "flex gap-2";
    actions.innerHTML = `
            <button id="resetBtn" style="
                flex: 1;
                padding: 8px 12px;
                background: #f8fafc;
                color: #64748b;
                border: 1px solid #e2e8f0;
                border-radius: 44px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
            ">
                恢复默认
            </button>
            <button id="saveBtn" style="
                flex: 1;
                padding: 8px 12px;
                background: #ff284b;
                color: white;
                border: none;
                border-radius: 44px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
            ">
                保存设置
            </button>
        `;

    // 组装内容
    content.appendChild(switchesSection);
    content.innerHTML += colorSettings;
    content.appendChild(hotkeysSettings);
    content.appendChild(actions);

    // 初始显示设置面板并设置激活态（放在这里以确保所有元素已创建）
    setActive("cfg-tab-settings");
    renderSettings();

    // 卡片已在前面组装并添加到页面，后续只需填充 `content`（即 main）

    // 获取元素
    const enableCustomSwitch = document.getElementById("enableCustomSwitch");
    const enableCustomThumb = document.getElementById("enableCustomThumb");
    const enableCustomContainer = document.getElementById(
      "enableCustomContainer"
    );

    const enableWatermarkSwitch = document.getElementById(
      "enableWatermarkSwitch"
    );
    const enableWatermarkThumb = document.getElementById(
      "enableWatermarkThumb"
    );
    const enableWatermarkContainer = document.getElementById(
      "enableWatermarkContainer"
    );

    const enableDragSwitch = document.getElementById("enableDragSwitch");
    const enableDragThumb = document.getElementById("enableDragThumb");
    const enableDragContainer = document.getElementById("enableDragContainer");

    const enableRightClickSwitch = document.getElementById("enableRightClickSwitch");
    const enableRightClickThumb = document.getElementById("enableRightClickThumb");
    const enableRightClickContainer = document.getElementById(
      "enableRightClickContainer"
    );

    const enableMouseenterSwitch = document.getElementById("enableMouseenterSwitch");
    const enableMouseenterThumb = document.getElementById("enableMouseenterThumb");
    const enableMouseenterContainer = document.getElementById(
      "enableMouseenterContainer"
    );

    const materialPreview = document.getElementById("materialPreview");
    const materialPicker = document.getElementById("materialPicker");
    const materialInput = document.getElementById("materialInput");
    const userPreview = document.getElementById("userPreview");
    const userPicker = document.getElementById("userPicker");
    const userInput = document.getElementById("userInput");
    const saveBtn = document.getElementById("saveBtn");
    const resetBtn = document.getElementById("resetBtn");

    // 开关事件处理器工厂函数 - 消除重复代码
    const createSwitchHandler = (
      switchElement,
      thumbElement,
      containerElement,
      callback
    ) => {
      return function () {
        const isChecked = this.checked;
        const switchBg = containerElement.querySelector("span:nth-child(2)");
        switchBg.style.backgroundColor = isChecked ? "#3b82f6" : "#e2e8f0";
        thumbElement.style.left = isChecked ? "22px" : "2px";
        if (typeof callback === "function") callback(isChecked);
      };
    };

    // 修复自定义背景色开关功能
    const handleCustomSwitch = createSwitchHandler(
      enableCustomSwitch,
      enableCustomThumb,
      enableCustomContainer,
      (isChecked) => {
        const colorSettingsContainer = document.getElementById(
          "colorSettingsContainer"
        );
        if (colorSettingsContainer) {
          colorSettingsContainer.style.display = isChecked ? "block" : "none";
        }
      }
    );

    // 去水印开关处理
    const handleWatermarkSwitch = createSwitchHandler(
      enableWatermarkSwitch,
      enableWatermarkThumb,
      enableWatermarkContainer,
      (isChecked) => {
        if (isChecked) {
          processWatermark(true);
        } else {
          // 关闭时恢复原始图片
          const materialImages = getMaterialImages();
          materialImages.forEach((img) => {
            if (img.dataset.originalSrc) {
              restoreOriginalUrl(img);
            }
          });
        }
      }
    );

    // 拖拽下载开关处理
    const handleDragSwitch = createSwitchHandler(
      enableDragSwitch,
      enableDragThumb,
      enableDragContainer
    );

    // 右键下载开关处理
    const handleRightClickSwitch = createSwitchHandler(
      enableRightClickSwitch,
      enableRightClickThumb,
      enableRightClickContainer
    );

    // 鼠标移入预加载开关处理
    const handleMouseenterSwitch = createSwitchHandler(
      enableMouseenterSwitch,
      enableMouseenterThumb,
      enableMouseenterContainer
    );

    // 绑定开关事件
    enableCustomSwitch.addEventListener("change", handleCustomSwitch);
    enableWatermarkSwitch.addEventListener("change", handleWatermarkSwitch);
    enableDragSwitch.addEventListener("change", handleDragSwitch);
    enableRightClickSwitch.addEventListener("change", handleRightClickSwitch);
    enableMouseenterSwitch.addEventListener("change", handleMouseenterSwitch);

    // 颜色选择器事件
    if (materialPicker) {
      materialPicker.addEventListener("change", function (e) {
        const color = e.target.value;
        if (materialPreview) materialPreview.style.background = color;
      });
    }

    if (userPicker) {
      userPicker.addEventListener("change", function (e) {
        const color = e.target.value;
        if (userPreview) userPreview.style.background = color;
      });
    }

    // 快捷键重置事件
    hotkeyItems.forEach((item) => {
      const resetBtn = document.getElementById(`reset-hotkey-${item.id}`);
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          const input = document.getElementById(`hotkey-${item.id}`);
          if (input) {
            input.value = `Ctrl+${item.defaultKey.toUpperCase()}`;
          }
        });
      }
    });

    // 保存设置
    saveBtn.addEventListener("click", () => {
      const newConfig = {
        materialColor: materialPicker ? materialPicker.value : config.materialColor,
        userColor: userPicker ? userPicker.value : config.userColor,
        enableCustom: enableCustomSwitch ? enableCustomSwitch.checked : config.enableCustom,
        enableRemoveWatermark: enableWatermarkSwitch ? enableWatermarkSwitch.checked : config.enableRemoveWatermark,
        enableDragDownload: enableDragSwitch ? enableDragSwitch.checked : config.enableDragDownload,
        enableRightClickDownload: enableRightClickSwitch ? enableRightClickSwitch.checked : config.enableRightClickDownload,
        enableMouseenterPreload: enableMouseenterSwitch ? enableMouseenterSwitch.checked : config.enableMouseenterPreload,
      };

      saveConfig(newConfig);
      applyStyles();

      // 显示保存成功反馈
      saveBtn.textContent = "已保存";
      saveBtn.style.background = "#10b981";
      setTimeout(() => {
        saveBtn.textContent = "保存设置";
        saveBtn.style.background = "#ff284b";
      }, 1000);

      // 如果去水印功能被启用，立即执行处理
      if (newConfig.enableRemoveWatermark) {
        processWatermark(true);
      }
    });

    // 恢复默认设置
    resetBtn.addEventListener("click", () => {
      // 重置颜色选择器
      if (materialPicker) materialPicker.value = DEFAULT_CONFIG.materialColor;
      if (userPicker) userPicker.value = DEFAULT_CONFIG.userColor;
      if (materialPreview) materialPreview.style.background = DEFAULT_CONFIG.materialColor;
      if (userPreview) userPreview.style.background = DEFAULT_CONFIG.userColor;

      // 重置开关
      if (enableCustomSwitch) enableCustomSwitch.checked = DEFAULT_CONFIG.enableCustom;
      if (enableWatermarkSwitch) enableWatermarkSwitch.checked = DEFAULT_CONFIG.enableRemoveWatermark;
      if (enableDragSwitch) enableDragSwitch.checked = DEFAULT_CONFIG.enableDragDownload;
      if (enableRightClickSwitch) enableRightClickSwitch.checked = DEFAULT_CONFIG.enableRightClickDownload;
      if (enableMouseenterSwitch) enableMouseenterSwitch.checked = DEFAULT_CONFIG.enableMouseenterPreload;

      // 触发开关变化事件
      handleCustomSwitch.call(enableCustomSwitch);
      handleWatermarkSwitch.call(enableWatermarkSwitch);
      handleDragSwitch.call(enableDragSwitch);
      handleRightClickSwitch.call(enableRightClickSwitch);
      handleMouseenterSwitch.call(enableMouseenterSwitch);

      // 重置快捷键
      hotkeyItems.forEach((item) => {
        const input = document.getElementById(`hotkey-${item.id}`);
        if (input) {
          input.value = `Ctrl+${item.defaultKey.toUpperCase()}`;
        }
      });
    });

    // 关闭面板
    container.addEventListener("click", (e) => {
      if (e.target === container) {
        document.body.removeChild(container);
        document.body.style.overflow = "auto";
      }
    });

    // ESC键关闭
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && container.parentNode) {
        document.body.removeChild(container);
        document.body.style.overflow = "auto";
      }
    });
  }

  // 显示使用说明弹窗（改为嵌入飞书文档）
  function showUsageGuide() {
    const feishuUrl =
      "https://ai-chimo.feishu.cn/wiki/E9SEwhoMmiv2CkkC1VgcAbRTnW3";
    window.open(feishuUrl, "_blank");
  }

  // ==================== 初始化 ====================

  // 初始化
  function init() {
    // 应用样式
    applyStyles();

    // 监听页面变化
    observePageChanges();

    // 实时监听图片变化
    observeImageChanges();

    // 拦截AJAX请求
    interceptAjaxRequests();

    // 拦截fetch请求
    interceptFetchRequests();

    // 拦截图片点击
    interceptImageClicks();

    // 拦截拖拽和右键下载
    interceptDragAndDownload();

    // 处理大图查看器
    handleImageViewer();

    // 在素材页面渲染网站列表
    renderMaterialSitesOnSucaiPage();

    // 监听 DOM 变化：处理异步加载的 ID 和图片容器
    const observer = new MutationObserver(() => {
      preloadHD();
      checkState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 针对 URL 变化（带参数跳转）的额外轮询 - 更频繁检查
    setInterval(() => {
      const config = getConfig();
      if (config.enableRemoveWatermark) {
        checkState();
      }
    }, 200); // 从500ms改为200ms，更频繁检查

    // 检查快捷键是否匹配
    const isHotkeyMatch = (e, hotkeyConfig) => {
      if (!hotkeyConfig) return false;
      const ctrlCmd = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const key = e.key.toLowerCase();

      return (
        ctrlCmd === hotkeyConfig.ctrlCmd &&
        shift === hotkeyConfig.shift &&
        alt === hotkeyConfig.alt &&
        key === hotkeyConfig.key
      );
    };

    // 添加快捷键处理
    document.addEventListener("keydown", (e) => {
      // 获取当前快捷键配置
      const hotkeysConfig = getHotkeysConfig();

      // 快速定位到搜索框
      if (isHotkeyMatch(e, hotkeysConfig.searchFocus)) {
        // 阻止默认行为
        e.preventDefault();
        // 查找搜索框并聚焦
        const searchInput = document.getElementById("hb_search_input");
        if (searchInput) {
          searchInput.focus();
          // 选中搜索框内容，方便直接输入新内容
          searchInput.select();

          // 查找data-button-name="搜索框"的元素并修改其:before伪元素背景色
          const searchButton = document.querySelector(
            '[data-button-name="搜索框"]'
          );
          if (searchButton) {
            // 添加类名以便修改伪元素样式
            searchButton.classList.add("hb-search-focused");

            // 8秒后移除类名，恢复原来的样式
            setTimeout(() => {
              searchButton.classList.remove("hb-search-focused");
            }, 8000);
          }
        }
      }

      // 以图搜索功能
      if (isHotkeyMatch(e, hotkeysConfig.imageSearch)) {
        // 查找以图搜索按钮
        const imageSearchButton = document.querySelector(
          '[data-button-name="以图搜索按钮"]'
        );

        if (imageSearchButton) {
          // 如果是第一次按下Ctrl+V/Cmd+V
          if (!isImageSearchMode) {
            // 阻止默认的粘贴行为
            e.preventDefault();
            // 模拟点击以图搜索按钮
            imageSearchButton.click();
            // 设置状态为true，表示已进入图片搜索模式
            isImageSearchMode = true;

            // 3秒后自动重置状态（如果用户没有进行第二次操作）
            setTimeout(() => {
              isImageSearchMode = false;
            }, 3000);
          } else {
            // 如果是第二次按下Ctrl+V/Cmd+V，恢复正常粘贴功能
            // 不阻止默认行为，让用户可以粘贴图片
            // 重置状态，以便下次使用
            isImageSearchMode = false;
          }
        }
      }

      // 打开设置界面
      if (isHotkeyMatch(e, hotkeysConfig.openSettings)) {
        // 阻止默认行为
        e.preventDefault();
        // 调用设置首选项函数
        createConfigUI();
      }
    });

    // 页面加载完成后执行水印处理
    window.addEventListener("load", () => {
      debugLog("页面加载完成，执行初始水印处理");
      setTimeout(() => {
        applyStyles();
        processWatermark(true); // 初始加载时强制处理，processWatermark函数内部会判断是否为VIP素材
      }, 500); // 延迟一点时间，确保页面完全渲染
    });

    // 定期检查（作为最后的保障）- 更频繁并检查开关
    setInterval(() => {
      const config = getConfig();
      if (config.enableRemoveWatermark) {
        processWatermark();
      }
    }, 1000); // 从2000ms改为1000ms，更频繁检查

    // 使用动态版本号输出日志（样式化控制台信息）
    (function () {
      const v = getScriptVersion();
      const s1 =
        "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold;";
      const s2 =
        "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF9999; font-weight: bold;";
      console.info(`%c 花瓣去水印 %c v${v} `, s1, s2);
    })();

    console.log('[花瓣脚本Pro] 双容器强力替换模式已启动');
  }

  init();
})();
// ==UserScript==
// @name         WeReadBetter-享阅（微信读书美化）
// @icon         https://weread.qq.com/favicon.ico
// @version      20251002
// @description  为微信读书打造的全能美化工具：多主题切换、自动滚屏、字体调节、页面优化。提升阅读体验，让每次阅读都是视觉享受。
// @author       StitchHu
// @match        https://weread.qq.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @resource     BG01 https://gitee.com/StitchHu/images/raw/master/%E7%BA%B8%E7%BA%B93.jpg
// @resource     BG02 https://gitee.com/StitchHu/images/raw/master/%E8%83%8C%E6%99%AF-%E7%BA%A2%E8%8A%B1.jpg
// @resource     BG03 https://gitee.com/StitchHu/images/raw/master/%E8%83%8C%E6%99%AF-%E8%BF%9C%E5%B1%B1.jpg
// @namespace https://greasyfork.org/users/1510853
// @downloadURL https://update.greasyfork.org/scripts/551016/WeReadBetter-%E4%BA%AB%E9%98%85%EF%BC%88%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BE%8E%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551016/WeReadBetter-%E4%BA%AB%E9%98%85%EF%BC%88%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BE%8E%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

// ==============================
  // 📝 基础功能配置 - 可根据个人喜好调整
  // ==============================
  const CONFIG = {
    // 🚀 自动滚动配置
    SCROLL_SPEED: 1,     // 自动滚动速度：数值越大滚动越快，建议范围 1-5
    INTERVAL_MS: 35,     // 滚动间隔毫秒数：数值越小滚动越流畅，建议范围 20-50
    
    // 📏 阅读栏宽度配置
    WIDTH_STEP: 100,     // 每次点击加宽/减宽的像素数：建议范围 50-200
    MIN_WIDTH: 400,      // 阅读栏最小宽度：防止过窄影响阅读体验
    MAX_WIDTH: 1300,     // 阅读栏最大宽度：防止过宽导致视线跨度过大
    
    // 🎯 界面隐藏/显示配置（单栏模式专用）
    HIDE_THRESHOLD: 30,  // 向下滚动多少像素开始隐藏顶部栏：数值越小越敏感
    HIDE_DISTANCE: 50,   // 完全隐藏需要的额外滚动距离：数值越大越不容易完全隐藏
    SHOW_THRESHOLD: 30,  // 向上滚动多少像素开始显示顶部栏：数值越小越敏感
    SHOW_DISTANCE: 50,   // 完全显示需要的额外滚动距离：数值越大越不容易完全显示
    
    // ✍️ 字体粗细配置
    // 100: '极细',
    // 200: '特细',
    // 300: '细体',
    // 400: '正常',
    // 500: '中等',
    // 600: '半粗',
    // 700: '粗体',
    // 800: '特粗',
    // 900: '极粗'

    // FONT_WEIGHTS: [100, 200, 300, 400, 500, 600, 700, 800, 900], // 可选择的字体粗细等级（共9个）
    FONT_WEIGHTS: [300, 400, 500, 600, 700], // 这里选择了其中5个等级
    DEFAULT_FONT_WEIGHT: 400 // 默认字体粗细：400为标准粗细
  };

  // ==============================
  // 🎨 主题配色方案 - 自定义你的阅读体验
  // ==============================
  // ==============================
  // 🔧 颜色搭配建议 - 帮助你选择合适的配色
  // ==============================
  /*
   * 📋 主题设计原则：
   * 1. textColor（正文色）与 readerBgColor（背景色）要有足够对比度
   * 2. backgroundColor 建议比 readerBgColor 稍深或稍浅，营造层次感
   * 3. readerButtonColor 建议选择中性色，不要过于鲜艳
   * 4. underlineColor 可选，用于书友想法划线，建议与主色调协调
   * 
   * 🎨 经典配色组合推荐：
   * - 护眼绿色系：背景 #E8F5E8，文字 #2F4F2F，按钮 #5F7F5F
   * - 温暖米色系：背景 #F5F5DC，文字 #8B4513，按钮 #CD853F  
   * - 冷色蓝灰系：背景 #F0F8FF，文字 #2F4F4F，按钮 #708090
   * - 深色护眼系：背景 #2F2F2F，文字 #E0E0E0，按钮 #8AA9FF
   * 
   * 💡 配色工具推荐：
   * - Adobe Color：https://color.adobe.com/zh/
   * - Coolors：https://coolors.co/
   * - 中国色：http://zhongguose.com/
   */
  const THEMES = [
    {
      name: '牛皮纸纹理',
      url: GM_getResourceURL("BG01"),
      textColor: '#2D1B15',
      backgroundColor: '#2D2419',
      readerButtonColor: '#4F4F4F', 
      underlineColor: '#2D2419',
      darkEnable: false,
    },
    {
      name: '花笺诗韵',
      url: GM_getResourceURL("BG02"),
      textColor: '#2F3D2A',   
      backgroundColor: '#CDD3C0', 
      readerButtonColor: '#6B7A5F', 
      underlineColor: '#8A9B7A',  
      darkEnable: false,
    },
    {
      name: '水墨清韵',
      url: GM_getResourceURL("BG03"),  
      textColor: '#2C3E50',   
      backgroundColor: '#D5D8DC', 
      readerButtonColor: '#5D6D7E',
      underlineColor: '#85929E',   
      darkEnable: false,
    },
    {
      name: '古典羊皮纸',
      readerBgColor: '#F5ECD9',
      textColor: '#3A2F24',
      backgroundColor: '#E6D9BC',
      readerButtonColor: '#B48A5A',
      darkEnable: false,
    },
    {
      name: '暮色森林',
      readerBgColor: '#404F37',
      textColor: '#D0D0D0',        
      backgroundColor: '#38442F',   
      readerButtonColor: '#7B8C6F',
      underlineColor: '#5A6B4E',
      darkEnable: true,
    },
    {
      name: '暖阳书香',
      readerBgColor: '#FDF6E3',
      textColor: '#8B4513',
      backgroundColor: '#F4E4BC',
      readerButtonColor: '#CD853F',
      underlineColor: '#DEB887',
      darkEnable: false    
    },
    {
      name: '春山茶纸',
      readerBgColor: '#D6DBBC',
      textColor: '#474E31',
      backgroundColor: '#C8D6B8',
      readerButtonColor: '#4E7B50',
      darkEnable: false,
    },
    {
      name: '雾霾灰调',
      readerBgColor: '#DEDEE3',
      textColor: '#2A2A2E',
      backgroundColor: '#EAEAEF',
      readerButtonColor: '#DEDEE',
      darkEnable: false,
    },
    {
      name: '静夜寂黑',
      readerBgColor: '#2E2E2E',
      textColor: '#EAEAEA',
      backgroundColor: '#242424',
      readerButtonColor: '#8AA9FF',
      darkEnable: false,
    },
    // 💡 如需添加自定义主题，请按以下格式添加：
    // {
    //   name: '你的主题名称',
    //   readerBgColor: '#颜色代码',    // 阅读区背景
    //   textColor: '#颜色代码',       // 正文字体颜色
    //   backgroundColor: '#颜色代码',  // 页面周围背景色
    //   readerButtonColor: '#颜色代码', // 按钮颜色
    //   underlineColor: '#颜色代码',   // 划线颜色
    //   darkEnable: true/false,       // 是否支持深色模式
    // },
  ];

  // SVG 图标配置
  const ICONS = {
    theme: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="10" cy="8" r="2"/></svg>`,
    scroll: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v14"/><path d="m19 9-7 7-7-7"/><circle cx="12" cy="21" r="1"/></svg>`,
    fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="8" x="7" y="8" rx="1"/></svg>`,
    decrease: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>`,
    increase: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
    fontWeight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`

  };

  // ==============================
  // 工具类
  // ==============================
  class Utils {
    static addStyle(css) {
      GM_addStyle(css);
    }

    static createElement(tag, className, innerHTML) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (innerHTML) element.innerHTML = innerHTML;
      return element;
    }

    static debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    static getCurrentValue(element, property) {
      const value = window.getComputedStyle(element)[property];
      return parseInt(value.replace('px', '')) || 0;
    }

    // 判断当前阅读模式
    static getReaderMode() {
      const horizontalReader = document.querySelector(
        ".readerControls_item.isHorizontalReader"
      );
      const normalReader = document.querySelector(
        ".readerControls_item.isNormalReader"
      );
      //normal为上下滚动阅读模式，会展示“isNormalReader”
      //horizontal表示水平双栏阅读模式
      return normalReader ? "normal" : "horizontal";
    }
    // 判断是否为深色模式
    static isDarkMode() {
      // 方法1: 检查深色模式按钮的类名状态
      const darkButton = document.querySelector('.readerControls_item.white');
      if (darkButton) {
        console.log("当前为深色模式！")
        return true;
      }
      console.log("当前为浅色模式！")
      return false;
    }
  }
  // ==============================
  // 按钮管理类
  // ==============================
  class ButtonManager {
    constructor() {
      this.buttons = new Map();
    }

    create(config) {
      const controls = document.querySelector('.readerControls');
      if (!controls || controls.querySelector('.' + config.className)) return null;

      const container = Utils.createElement('div', 'wr_tooltip_container');
      container.setAttribute('style', '--offset: 6px;');

      const btn = Utils.createElement('button', `${config.className} readerControls_item`, config.icon);
      const tooltip = Utils.createElement('div', 'wr_tooltip_item wr_tooltip_item--right', config.tooltip);
      tooltip.style.display = 'none';

      container.appendChild(btn);
      container.appendChild(tooltip);

      // 添加悬停效果
      container.addEventListener('mouseenter', () => tooltip.style.display = 'block');
      container.addEventListener('mouseleave', () => tooltip.style.display = 'none');

      if (config.onClick) {
        btn.addEventListener('click', config.onClick);
      }

      controls.appendChild(container);
      this.buttons.set(config.className, btn);
      return btn;
    }

    get(className) {
      return this.buttons.get(className);
    }
  }

  // ==============================
  // 自动滚动管理类
  // ==============================
  class ScrollManager {
    constructor() {
      this.scrolling = false;
      this.scrollTimer = null;
    }

    start() {
      if (this.scrolling) return;
      this.scrolling = true;
      this.scrollTimer = setInterval(() => {
        window.scrollBy(0, CONFIG.SCROLL_SPEED);
      }, CONFIG.INTERVAL_MS);
    }

    stop() {
      this.scrolling = false;
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    }

    toggle(button) {
      if (this.scrolling) {
        this.stop();
        button.classList.remove('active');
        button.title = '开始自动滚动';
      } else {
        this.start();
        button.classList.add('active');
        button.title = '暂停自动滚动';
      }
    }
  }

  // ==============================
  // 主题管理类
  // ==============================
  class ThemeManager {
    constructor() {
      this.currentTheme = GM_getValue('currentTheme', null);
      this.modal = null;
    }

    // 获取应用背景色的目标元素
    getTargetElement() {
      const mode = Utils.getReaderMode();
      if (mode === "normal") {
        //上下
        return document.querySelector(".app_content");
      } else {
        //水平
        return document.querySelector(".readerChapterContent");
      }
    }
    applyTheme(theme) {
      // 如果是默认主题，清除所有自定义样式
      // if (theme.isDefault) {
      //   this.clearCustomStyles();
      //   return;
      // }

      const content = this.getTargetElement();

      if (content) {
        if (theme.url) {
          content.style.cssText += `
            background-image: url(${theme.url});
            background-size: auto;
            background-position: center top;
            background-attachment: fixed;
            background-repeat: repeat;
            image-rendering: crisp-edges;
          `;
        } else if (theme.readerBgColor) {
          content.style.cssText += `
            background-image: none;
            background-color: ${theme.readerBgColor};
          `;
        }
      }

      if (Utils.getReaderMode() === "normal"){
        //针对上下模式的容器
        Utils.addStyle(`
          .readerChapterContent {
            color: ${theme.textColor} !important;
          }
          .readerContent {
            background-color: ${theme.backgroundColor};
          }
          .readerFooter_button {
            color: ${theme.readerButtonColor} !important;
          }
          .readerHeaderButton {
            color: ${theme.readerButtonColor} !important;
          }
        `);   
      }else{
        //针对水平模式的容器
        let styles = `
          .readerChapterContent {
            color: ${theme.textColor} !important;
          }
          .readerContent {
            background-color: ${theme.backgroundColor};
          }
          .readerFooter_button {
            color: ${theme.readerButtonColor} !important;
          }
          .readerHeaderButton {
            color: ${theme.readerButtonColor} !important;
          }
          .readerChapterContent_container {
            color: ${theme.textColor} !important;
            background-color: ${theme.backgroundColor} !important;
          }
          .readerTopBar {
            background-color: ${theme.backgroundColor} !important;
          }
          .renderTargetPageInfo_header_chapterTitle {
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_module_rating_graph_badge_wrapper{
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_module_rating_stats_item_content{
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_module_rating_stats_wrapper {
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_module_rating_stats_item_content {
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_module_rating_action_button {
            color: ${theme.textColor} !important;
          }
          .wr_whiteTheme .wr_flyleaf_module_rating_stats_wrapper .wr_flyleaf_module_rating_stats_item_label {
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_module_rating_graph_bar_wrapper {
            color: ${theme.textColor} !important;
          }
          .wr_flyleaf_page wr_flyleaf_page_bookInfo {
            color: ${theme.textColor} !important;
          }
          .wr_whiteTheme .wr_flyleaf_page_bookInfo_author.wr_flyleaf_page_bookInfo_author_clickable {
            color: ${theme.textColor} !important;
          }
          .wr_whiteTheme .wr_flyleaf_module_rating_top_section .wr_flyleaf_module_rating_title {
            color: ${theme.textColor} !important;
          }
        `;
        // 划线颜色适配：当主题有配置underlineColor时才添加划线颜色样式
        if (theme.underlineColor) {
          styles += `
          .wr_underline_thought {
              border-bottom-color: ${theme.underlineColor} !important;
          }
          `;
        }
        Utils.addStyle(styles);
      }
      // 添加深色模式按钮监听，当非深色模式可用主题时，点击按钮清空样式
      document.addEventListener('click', (event) => {
        // 检查点击的是否是深色模式按钮
        if (event.target.closest('button.readerControls_item.white') && !this.currentTheme.darkEnable) {
          console.log('检测到深色模式按钮点击,且当前主题不支持深色模式！');
          // 延迟执行，确保微信阅读的模式切换完成
          setTimeout(() => {
            this.clearCustomStyles();
          }, 150);
        }
      });
    }

    // 默认主题：清除自定义样式的方法
    clearCustomStyles() {
      // 移除所有自定义添加的样式标签
      const customStyles = document.querySelectorAll('style[id*="GM_"], style[id="font-weight-style"]');
      customStyles.forEach(style => style.remove());
      
      // 清除内联样式
      const content = this.getTargetElement();
      if (content) {
        content.style.cssText = '';
      }
      
      // 重置body背景
      const body = document.querySelector('body');
      if (body) {
        body.style.backgroundColor = '';
      }
      
      // 清除存储的主题和字体粗细
      GM_setValue('currentTheme', null);
      GM_setValue('currentFontWeight', 400);
      console.log('已恢复默认主题');
      location.reload();
    }

  openModal() {
    if (this.modal) return;

    const isDarkMode = Utils.isDarkMode();
    
    const overlay = Utils.createElement('div', 'bg-overlay');
    overlay.addEventListener('click', () => this.closeModal());

    const modal = Utils.createElement('div', 'bg-modal');
    const closeBtn = Utils.createElement('button', 'bg-close', '×');
    closeBtn.addEventListener('click', () => this.closeModal());
    
    const title = Utils.createElement('h3', '', '选择阅读主题');
    
    // 添加当前模式提示
    // const modeIndicator = Utils.createElement('div', 'theme-mode-indicator', 
    //   `当前模式: ${isDarkMode ? '深色模式' : '浅色模式'}`);
    
    const grid = Utils.createElement('div', 'bg-grid');

    THEMES.forEach((theme) => {
      const item = Utils.createElement('div', 'bg-item');
      item.setAttribute('data-name', theme.name);
      
      // 检查主题在当前模式下是否可用
      const isEnabled = isDarkMode ? theme.darkEnable : true;
      
      if (!isEnabled) {
        item.classList.add('disabled');
      }
      
      if (theme.url) {
        item.style.backgroundImage = `url(${theme.url})`;
      } else if (theme.readerBgColor) {
        item.style.backgroundColor = theme.readerBgColor;
      }

      // 添加禁用状态的视觉反馈
      if (!isEnabled) {
        const disabledOverlay = Utils.createElement('div', 'disabled-overlay');
        const disabledText = Utils.createElement('div', 'disabled-text', 
          `${isDarkMode ? '深色模式' : '浅色模式'}不支持`);
        disabledOverlay.appendChild(disabledText);
        item.appendChild(disabledOverlay);
      }

      // 添加当前选中的主题标记
      if (this.currentTheme && this.currentTheme.name === theme.name) {
        item.classList.add('selected');
        const selectedMark = Utils.createElement('div', 'selected-mark', '✓');
        item.appendChild(selectedMark);
      }

      item.addEventListener('click', () => {
        if (!isEnabled) {
          // 显示提示信息
          this.showDisabledTooltip(item, `此主题在${isDarkMode ? '深色' : '浅色'}模式下不可用`);
          return;
        }
        
        GM_setValue('currentTheme', theme);
        location.reload();
      });

      grid.appendChild(item);
    });

    // 添加重置按钮
    const resetBtn = Utils.createElement('button', 'theme-reset-btn', '恢复默认主题');
    resetBtn.addEventListener('click', () => {
      GM_setValue('currentTheme', null);
      location.reload();
    });

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    // modal.appendChild(modeIndicator);
    modal.appendChild(grid);
    modal.appendChild(resetBtn);
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    this.modal = { modal, overlay };
  }

  // 显示禁用主题的提示
  showDisabledTooltip(element, message) {
    const tooltip = Utils.createElement('div', 'disabled-tooltip', message);
    element.appendChild(tooltip);
    
    setTimeout(() => {
      tooltip.classList.add('show');
    }, 10);

    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300);
    }, 2000);
  }

  closeModal() {
    if (!this.modal) return;
    
    const { modal, overlay } = this.modal;
    modal.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
    overlay.style.animation = 'fadeOut 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
    
    setTimeout(() => {
      modal.remove();
      overlay.remove();
      document.body.style.overflow = '';
      this.modal = null;
    }, 400);
  }


    init() {
      if (this.currentTheme) {
        this.applyTheme(this.currentTheme);
      }
    }
  }

  // ==============================
  // 宽度管理类
  // ==============================
  class WidthManager {
    constructor() {
      this.elements = {
        content: () => document.querySelector(".readerContent .app_content"),
        topBar: () => document.querySelector('.readerTopBar'),
        controls: () => document.querySelector('.readerControls')
      };
    }

    changeWidth(increase) {
      const content = this.elements.content();
      const topBar = this.elements.topBar();
      const controls = this.elements.controls();
      
      if (!content || !topBar) return;

      const currentValue = Utils.getCurrentValue(content, 'maxWidth');
      const currentMargin = Utils.getCurrentValue(controls, 'marginLeft');
      
      let newValue = increase ? 
        Math.min(currentValue + CONFIG.WIDTH_STEP, CONFIG.MAX_WIDTH) :
        Math.max(currentValue - CONFIG.WIDTH_STEP, CONFIG.MIN_WIDTH);
      
      let newMargin = currentMargin + (newValue - currentValue) / 2;

      content.style.maxWidth = newValue + 'px';
      topBar.style.maxWidth = newValue + 'px';
      
      if (controls) {
        controls.style.marginLeft = newMargin + 'px';
        controls.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
      }

      window.dispatchEvent(new Event('resize'));
      this.updateButtonStates(newValue);
    }

    updateButtonStates(currentWidth) {
      const decreaseBtn = document.querySelector('.width-decrease-btn');
      const increaseBtn = document.querySelector('.width-increase-btn');
      
      [decreaseBtn, increaseBtn].forEach(btn => {
        if (!btn) return;
        const isDisabled = (btn === decreaseBtn && currentWidth <= CONFIG.MIN_WIDTH) ||
                          (btn === increaseBtn && currentWidth >= CONFIG.MAX_WIDTH);
        btn.style.opacity = isDisabled ? '0.5' : '1';
        btn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
      });
    }
  }

  // ==============================
  // 顶部栏及控制栏自动隐藏类
  // ==============================
  class TopBarManager {
    constructor() {
      this.lastScrollY = window.scrollY;
      this.baseScrollY = window.scrollY;
      this.currentState = 'visible';
      this.ticking = false;

      // 双栏模式下控制
      this.hideTimer = null;
      this.mouseInside = false;
    }

    setup() {
      const topBar = document.querySelector('.readerTopBar');
      const controls = document.querySelector('.readerControls');

      if (!topBar || !controls) return;

      topBar.style.transition = 'transform 0.3s ease';
      controls.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      // controls.style.willChange = 'opacity, transform';

      if(Utils.getReaderMode() !== "horizontal"){
        //单栏
        const onScroll = () => {
          const currentY = window.scrollY;
          const scrollDelta = currentY - this.lastScrollY;

          if (scrollDelta > 0) {
            this.handleDownScroll(currentY, topBar, controls);
          } else if (scrollDelta < 0) {
            this.handleUpScroll(currentY, topBar, controls);
          }

          this.lastScrollY = currentY;
          this.ticking = false;
        };

        window.addEventListener('scroll', () => {
          if (!this.ticking) {
            window.requestAnimationFrame(onScroll);
            this.ticking = true;
          }
        });
        // 鼠标进入控制栏：立刻显示并清除定时器
        controls.addEventListener('mouseenter', () => {
          controls.style.opacity = '1';
        });      
      }else{
        // ==== 双栏模式：3s 自动隐藏 + 悬停渐显 ====
        this.setupHorizontalMode(controls);
      }

    }

    handleDownScroll(currentY, topBar, controls) {
      if (this.currentState === 'visible' || this.currentState === 'showing') {
        this.baseScrollY = currentY;
        this.currentState = 'hiding';
      }

      if (this.currentState === 'hiding' || this.currentState === 'hidden') {
        const hideScroll = currentY - this.baseScrollY;
        if (hideScroll > CONFIG.HIDE_THRESHOLD) {
          const hideProgress = Math.min((hideScroll - CONFIG.HIDE_THRESHOLD) / CONFIG.HIDE_DISTANCE, 1);
          topBar.style.transform = `translateY(${-100 * hideProgress}%)`;
          controls.style.opacity = '0';
          // controls.style.opacity = 1 - hideProgress;
          // controls.style.transform = 'none';

          if (hideProgress >= 1) {
            this.currentState = 'hidden';
          }
        }
      }
    }

    handleUpScroll(currentY, topBar, controls) {
      if (this.currentState === 'hidden' || this.currentState === 'hiding') {
        this.baseScrollY = currentY;
        this.currentState = 'showing';
      }

      if (this.currentState === 'showing' || this.currentState === 'visible') {
        const showScroll = this.baseScrollY - currentY;
        if (showScroll > CONFIG.SHOW_THRESHOLD) {
          const showProgress = Math.min((showScroll - CONFIG.SHOW_THRESHOLD) / CONFIG.SHOW_DISTANCE, 1);
          const hideProgress = 1 - showProgress;
          
          topBar.style.transform = `translateY(${-100 * hideProgress}%)`;
          controls.style.opacity = '1';
          // controls.style.opacity = 1 - hideProgress;
          // controls.style.transform = 'none';

          if (showProgress >= 1) {
            this.currentState = 'visible';
          }
        }
      }
    }

    /* ---------- 双栏模式专用 ---------- */
    setupHorizontalMode(controls) {
      // 初次进入 3 秒后隐藏
      this.startHideTimer(controls);

      // 鼠标进入控制栏：立刻显示并清除定时器
      controls.addEventListener('mouseenter', () => {
        this.mouseInside = true;
        this.showControls(controls);
        this.clearHideTimer();
      });

      // 鼠标离开控制栏：3 秒后隐藏
      controls.addEventListener('mouseleave', () => {
        this.mouseInside = false;
        this.startHideTimer(controls);
      });
    }

    startHideTimer(controls) {
      this.clearHideTimer();
      this.hideTimer = setTimeout(() => {
        if (!this.mouseInside) {
          this.hideControls(controls);
        }
      }, 3000); // 3 秒
    }

    clearHideTimer() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    }

    hideControls(controls) {
      controls.style.opacity = '0';
      // controls.style.transform = 'translateX(40px)';
      // controls.style.pointerEvents = 'none';
    }

    showControls(controls) {
      controls.style.opacity = '1';
      // controls.style.transform = 'translateX(0)';
      // controls.style.pointerEvents = 'auto';
    }
  }

// ==============================
// 字体粗细滑块管理类 - 支持自定义粗细等级
// ==============================
class FontWeightSliderManager {
  constructor() {
    // 从存储中获取当前字体粗细，默认使用配置的默认值
    this.currentWeight = GM_getValue('currentFontWeight', CONFIG.DEFAULT_FONT_WEIGHT);
    this.popup = null;
    this.isPopupVisible = false;
    // 使用配置的字体粗细等级
    this.fontWeights = CONFIG.FONT_WEIGHTS;
  }

  /**
   * 创建字体粗细调节悬浮框
   */
  createPopup(button) {
    const popup = Utils.createElement('div', 'font-weight-popup');
    const title = Utils.createElement('div', 'font-weight-title', '字体粗细');
    const sliderContainer = Utils.createElement('div', 'font-weight-slider-container');
    
    // 创建左侧标签（细）
    const leftLabel = Utils.createElement('span', 'font-weight-label left', 'A');
    leftLabel.style.fontWeight = this.fontWeights[0]; // 使用配置的最小值
    
    // 创建滑块 - 动态设置范围
    const slider = Utils.createElement('input', 'font-weight-slider');
    slider.type = 'range';
    slider.min = '0'; // 使用索引而不是实际值
    slider.max = String(this.fontWeights.length - 1);
    slider.step = '1';
    // 找到当前值在数组中的索引
    const currentIndex = this.fontWeights.indexOf(this.currentWeight);
    slider.value = currentIndex >= 0 ? currentIndex : Math.floor(this.fontWeights.length / 2);
    
    // 创建右侧标签（粗）
    const rightLabel = Utils.createElement('span', 'font-weight-label right', 'A');
    rightLabel.style.fontWeight = this.fontWeights[this.fontWeights.length - 1]; // 使用配置的最大值
    
    // 创建当前值显示
    const valueDisplay = Utils.createElement('div', 'font-weight-value');
    this.updateValueDisplay(valueDisplay, this.currentWeight);
    
    // 组装滑块容器
    sliderContainer.appendChild(leftLabel);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(rightLabel);
    
    // 组装悬浮框
    popup.appendChild(title);
    popup.appendChild(sliderContainer);
    popup.appendChild(valueDisplay);
    
    // 绑定滑块事件 - 根据索引获取实际值
    slider.addEventListener('input', (e) => {
      const index = parseInt(e.target.value);
      const weight = this.fontWeights[index];
      this.currentWeight = weight;
      this.updateValueDisplay(valueDisplay, weight);
      this.applyFontWeight(weight);
      GM_setValue('currentFontWeight', weight);
    });
    
    // 添加滑块变化完成事件（松开鼠标时）
    slider.addEventListener('change', () => {
      location.reload();
    });
    
    // 定位悬浮框
    this.positionPopup(popup, button);
    
    return popup;
  }

  /**
   * 更新值显示 - 支持自定义字体粗细值
   */
  updateValueDisplay(valueDisplay, weight) {
    // 预定义常见的字体粗细名称
    const weightNames = {
      100: '极细',
      200: '特细',
      300: '细体',
      400: '正常',
      500: '中等',
      600: '半粗',
      700: '粗体',
      800: '特粗',
      900: '极粗'
    };
    
    // 如果有预定义名称就使用，否则显示数值
    const displayText = weightNames[weight] || `${weight}`;
    valueDisplay.textContent = displayText;
    
    // 添加当前数值显示
    if (!weightNames[weight]) {
      valueDisplay.textContent = `粗细 ${weight}`;
    }
  }

  /**
   * 定位悬浮框
   */
  positionPopup(popup, button) {
    const buttonRect = button.getBoundingClientRect();
    popup.style.position = 'fixed';
    popup.style.right = (window.innerWidth - buttonRect.left + 10) + 'px';
    popup.style.top = (buttonRect.top - 10) + 'px';
    popup.style.zIndex = '10000';
  }

  /**
   * 应用字体粗细样式
   */
  applyFontWeight(weight) {
    const mode = Utils.getReaderMode();
    
    // 移除之前的样式
    const existingStyle = document.querySelector('#font-weight-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // 创建新的样式
    const style = document.createElement('style');
    style.id = 'font-weight-style';
    
    if (mode === "normal") {
      style.textContent = `
        .readerChapterContent {
          font-weight: ${weight} !important;
        }
      `;
    } else {
      style.textContent = `
        .readerChapterContent,
        .readerChapterContent_container {
          font-weight: ${weight} !important;
        }
      `;
    }
    
    document.head.appendChild(style);
  }

  /**
   * 显示悬浮框
   */
  showPopup(button) {
    if (this.isPopupVisible) {
      this.hidePopup();
      return;
    }

    this.popup = this.createPopup(button);
    document.body.appendChild(this.popup);
    this.isPopupVisible = true;

    setTimeout(() => {
      document.addEventListener('click', this.handleDocumentClick.bind(this));
    }, 100);
  }

  /**
   * 隐藏悬浮框
   */
  hidePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
      this.isPopupVisible = false;
      document.removeEventListener('click', this.handleDocumentClick.bind(this));
    }
  }

  /**
   * 处理文档点击事件
   */
  handleDocumentClick(e) {
    if (this.popup && !this.popup.contains(e.target) && 
        !e.target.closest('.font-weight-btn')) {
      this.hidePopup();
    }
  }

  /**
   * 初始化字体粗细
   */
  init() {
    // 确保当前值在配置的范围内
    if (!this.fontWeights.includes(this.currentWeight)) {
      console.warn(`字体粗细 ${this.currentWeight} 不在配置范围内，使用默认值 ${CONFIG.DEFAULT_FONT_WEIGHT}`);
      this.currentWeight = CONFIG.DEFAULT_FONT_WEIGHT;
      GM_setValue('currentFontWeight', this.currentWeight);
    }
    this.applyFontWeight(this.currentWeight);
  }
}

// 样式定义
const FONT_WEIGHT_POPUP_STYLES = `
  /* 字体粗细悬浮框样式 */
  .font-weight-popup {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    padding: 20px;
    width: 280px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: popupFadeIn 0.2s ease-out;
  }

  .font-weight-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    text-align: center;
  }

  .font-weight-slider-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .font-weight-label {
    font-size: 14px;
    color: #666;
    min-width: 20px;
    text-align: center;
  }

  .font-weight-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 6px;
    border-radius: 3px;
    background: #e0e0e0;
    outline: none;
    cursor: pointer;
  }

  .font-weight-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1D88EE;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(29, 136, 238, 0.3);
    transition: all 0.2s ease;
  }

  .font-weight-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(29, 136, 238, 0.4);
  }

  .font-weight-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1D88EE;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(29, 136, 238, 0.3);
    transition: all 0.2s ease;
  }

  .font-weight-value {
    text-align: center;
    font-size: 14px;
    color: #1D88EE;
    font-weight: 600;
    padding: 8px 16px;
    background: rgba(29, 136, 238, 0.1);
    border-radius: 8px;
  }

  @keyframes popupFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;



  // ==============================
  // 主应用类
  // ==============================
  class WeReadEnhancer {
    constructor() {
      this.buttonManager = new ButtonManager();
      this.scrollManager = new ScrollManager();
      this.themeManager = new ThemeManager();
      this.widthManager = new WidthManager();
      this.topBarManager = new TopBarManager();
      this.fontWeightSliderManager = new FontWeightSliderManager();
      this.observer = null;
    }

    init() {
      this.addStyles();
      this.setupObserver();
      // this.themeManager.init();
      // this.fontWeightSliderManager.init();
      // 延迟初始化顶部栏管理器，确保DOM已完全加载
      setTimeout(() => {
        // this.topBarManager.setup();
        this.createButtons();
        this.fontWeightSliderManager.init();
      }, 500);
      Utils.isDarkMode();
    }

    addStyles() {
      Utils.addStyle(`
        /* 通用按钮样式 */
        .readerControls_item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          border-radius: 50%;
          transition: all 0.3s ease;
          color: #868C96;
        }
        
        .readerControls_item:hover {
          color: #212832;
          transform: scale(1.05);
        }
        
        .auto-scroll-btn.active {
          color: #1D88EE;
        }
        
        .width-control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* 主题选择器增强样式 */
        .bg-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9998;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }
        
        .bg-modal {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          padding: 32px;
          z-index: 9999;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideIn 0.3s ease;
        }
        
        .bg-modal h3 {
          margin: 0 0 16px 0;
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          color: #333;
        }

        // .theme-mode-indicator {
        //   text-align: center;
        //   margin-bottom: 24px;
        //   padding: 8px 16px;
        //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        //   color: white;
        //   border-radius: 20px;
        //   font-size: 14px;
        //   font-weight: 500;
        // }
        
        .bg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .bg-item {
          width: 100%;
          height: 120px;
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .bg-item:not(.disabled):hover {
          border-color: #4caf50;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .bg-item.selected {
          border-color: #2196F3;
          box-shadow: 0 4px 20px rgba(33, 150, 243, 0.4);
        }

        .bg-item.disabled {
          cursor: not-allowed;
          // opacity: 0.8;
          filter: grayscale(0.8);
        }

        .bg-item.disabled:hover {
          transform: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .disabled-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bg-item.disabled:hover .disabled-overlay {
          opacity: 1;
        }

        .disabled-text {
          color: white;
          font-size: 12px;
          text-align: center;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        .selected-mark {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: #2196F3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
        }

        .disabled-tooltip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(244, 67, 54, 0.95);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 10;
          pointer-events: none;
        }

        .disabled-tooltip.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .bg-item::after {
          content: attr(data-name);
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 16px 8px 8px;
          font-size: 12px;
          text-align: center;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .bg-item:not(.disabled):hover::after {
          opacity: 1;
          transform: translateY(0);
          background: #ABABAB
        }

        .theme-reset-btn {
          width: 100%;
          padding: 12px;
          background: #F4F5F7;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #202832
        }

        .theme-reset-btn:hover {
          background: #E2E3E5;
          transform: translateY(-2px);
          color: #202832
        }
        
        .bg-close {
          position: absolute;
          top: 16px; right: 16px;
          width: 32px; height: 32px;
          border: none;
          background: #F4F5F7;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #666;
          transition: all 0.3s ease;
        }
        
        .bg-close:hover {
          background: #E2E3E5;
          transform: translateY(-2px);
          color: #202832;
        }

        /* 动画 */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideOut {
          from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        }
      `);
      Utils.addStyle(FONT_WEIGHT_POPUP_STYLES);
    }

    createButtons() {
      const basicButtonConfigs = [
        {
          className: 'font-weight-btn',
          icon: ICONS.fontWeight,
          tooltip: '字体粗细',
          onClick: () => {
            const btn = this.buttonManager.get('font-weight-btn');
            this.fontWeightSliderManager.showPopup(btn);
          }
        },
        {
          className: 'bg-select-btn',
          icon: ICONS.theme,
          tooltip: '切换主题',
          onClick: () => this.themeManager.openModal()
        },
        {
          className: 'full-screen-btn',
          icon: ICONS.fullscreen,
          tooltip: '沉浸式',
          onClick: () => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }
        },
      ];
      //滚动模式独有的按钮
      const normalButtonConfigs = [
        { 
          className: 'auto-scroll-btn',
          icon: ICONS.scroll,
          tooltip: '自动滚动',
          onClick: () => {
            const btn = this.buttonManager.get('auto-scroll-btn');
            this.scrollManager.toggle(btn);
          }
        },
        {
          className: 'width-increase-btn',
          icon: ICONS.increase,
          tooltip: '加宽',
          onClick: () => this.widthManager.changeWidth(true)
        },
        {
          className: 'width-decrease-btn',
          icon: ICONS.decrease,
          tooltip: '减宽',
          onClick: () => this.widthManager.changeWidth(false)
        }
      ]

      let buttonConfigs;
      if (Utils.getReaderMode() === "normal") {
        buttonConfigs = basicButtonConfigs.concat(normalButtonConfigs);
        //滚动模式按钮多，防止溢出
        //TODO
        Utils.addStyle(`
          .readerControls {
            top: 5% !important;
          }
          .readerControls>* {
            margin-bottom: 15px;
          }
        `);
      } else {
        buttonConfigs = basicButtonConfigs;
      }
      buttonConfigs.forEach(config => this.buttonManager.create(config));

    }

    setupObserver() {
      this.observer = new MutationObserver(Utils.debounce(() => {
        // this.createButtons();
        // 确保顶部栏管理器重新初始化relo
        setTimeout(() => {
          this.topBarManager.setup();
        }, 100);
        if (this.themeManager.currentTheme) {
          this.themeManager.applyTheme(this.themeManager.currentTheme);
        }
      }, 100));

      this.observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }
  }

  // ==============================
  // 启动应用
  // ==============================
  const app = new WeReadEnhancer();
  app.init();
})();
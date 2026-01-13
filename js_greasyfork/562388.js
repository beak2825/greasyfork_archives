// ==UserScript==
// @name         CCEditor Launcher
// @namespace    https://lenml.github.io/CCEditor
// @version      0.1.3
// @description  Add CCEditor jump button to character sites
// @author       lenML
// @match        https://chub.ai/*
// @grant        none
// @license         MIT
// @supportURL      https://github.com/lenML/cc-editor-user-js/issues
// @downloadURL https://update.greasyfork.org/scripts/562388/CCEditor%20Launcher.user.js
// @updateURL https://update.greasyfork.org/scripts/562388/CCEditor%20Launcher.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /*********************************
   * Config
   *********************************/
  const CONFIG = {
    ccEditorBaseUrl: "https://lenml.github.io/CCEditor/",
    buttonText: "📝Edit in CCEditor",
    buttonClass: "cceditor-jump-btn",
  };

  /*********************************
   * Utils
   *********************************/
  class DomUtil {
    static createButton(text) {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.className = CONFIG.buttonClass;
      Object.assign(btn.style, {
        padding: "6px 10px",
        marginLeft: "8px",
        fontSize: "12px",
        cursor: "pointer",
        borderRadius: "0px",
        border: "0px",
        background: "inherit",
        color: "inherit",
        textDecoration: "underline",
      });
      return btn;
    }
  }

  /*********************************
   * Abstract Site Adapter
   *********************************/
  class SiteAdapter {
    /**
     * 是否匹配当前站点
     * @returns {boolean}
     */
    match() {
      throw new Error("match() not implemented");
    }

    /**
     * 从页面中解析 character card png url
     *
     * @returns {string | null}
     */
    getCardImageUrl() {
      throw new Error("getCardImageUrl() not implemented");
    }

    /**
     * 返回按钮插入的 DOM 节点
     *
     * @returns {Element | null}
     */
    getInsertTarget() {
      throw new Error("getInsertTarget() not implemented");
    }
  }

  /*********************************
   * Chub.ai Adapter
   *********************************/
  class ChubAdapter extends SiteAdapter {
    pattern = /\/characters\/([\w_\-]+)\/([\w_\-]+)/i;

    match() {
      return (
        location.hostname === "chub.ai" && this.pattern.test(location.pathname)
      );
    }

    /**
     * chub 页面通常有 <img> 指向 chara_card_v2.png
     * 兜底：从页面所有 img 中扫描
     */
    getCardImageUrl() {
      const [, uid, cid] = this.pattern.exec(location.pathname) || [];
      if (uid && cid) {
        return `https://avatars.charhub.io/avatars/${uid}/${cid}/chara_card_v2.png`;
      }
      return null;
    }

    /**
     * 插到角色标题附近
     */
    getInsertTarget() {
      return document.querySelector("main h3")?.parentElement || null;
    }
  }

  /*********************************
   * CCEditor Launcher
   *********************************/
  class CCEditorLauncher {
    constructor(adapters) {
      /**
       * @type {SiteAdapter[]}
       */
      this.adapters = adapters;
    }

    get injected() {
      return !!document.body.querySelector(`.${CONFIG.injectClass}`);
    }

    fire() {
      this.waitForDom(() => {
        if (this.injected) return true;
        const adapter = this.adapters.find((a) => a.match());
        if (!adapter) return true; // 直接结束，因为匹配不上
        const target = adapter.getInsertTarget();
        const imgUrl = adapter.getCardImageUrl();

        if (!target || !imgUrl) return false;

        this.injectButton(target, imgUrl);
        return true;
      });
    }

    waitForDom(cb) {
      let is_done = false;
      const cbs = [() => (is_done = true)];
      const done = () => cbs.forEach((cb) => cb());
      const run_cb = () => {
        if (is_done) return;
        if (cb()) return done;
      };
      const timer = setInterval(run_cb, 500);
      cbs.push(() => clearInterval(timer));
      const observer = new MutationObserver(run_cb);
      cbs.push(() => observer.disconnect());
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      run_cb();
    }

    injectButton(target, imgUrl) {
      if (target.querySelector(`.${CONFIG.buttonClass}`)) return;

      const btn = DomUtil.createButton(CONFIG.buttonText);
      btn.onclick = () => {
        const url = this.buildEditorUrl(imgUrl);
        window.open(url, "_blank");
      };

      target.appendChild(btn);
    }

    buildEditorUrl(imageUrl) {
      const encoded = encodeURIComponent(imageUrl);
      return `${CONFIG.ccEditorBaseUrl}?load_url=${encoded}`;
    }
  }

  /**
   * 动态内容加载检测器
   * 替代传统的 onload 事件，专门用于检测动态生成的 HTML 页面
   */
  class DynamicContentLoader {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     * @param {number} options.quietPeriod 静默期（毫秒）- 在此时间内没有新变化则认为加载完成
     * @param {number} options.maxWaitTime 最大等待时间（毫秒）- 超时后强制触发完成
     * @param {string} options.targetSelector 目标选择器 - 仅监听特定元素内的变化
     */
    constructor(options = {}) {
      // 默认配置
      this.config = {
        quietPeriod: 500, // 500ms静默期
        maxWaitTime: 10000, // 10秒超时
        targetSelector: null, // 默认监听整个body
        ...options,
      };

      // 状态变量
      this.observer = null;
      this.quietTimer = null;
      this.timeoutTimer = null;
      this.isLoading = false;
      this.isComplete = false;

      // 回调函数
      this.onComplete = null;
      this.onTimeout = null;

      // 绑定方法
      this.handleMutation = this.handleMutation.bind(this);
      this.resetQuietTimer = this.resetQuietTimer.bind(this);
    }

    /**
     * 开始监听页面变化
     * @param {Function} onComplete 加载完成回调
     * @param {Function} onTimeout 超时回调（可选）
     */
    start(onComplete, onTimeout = null) {
      if (this.isLoading) {
        console.warn("DynamicContentLoader is already running");
        return;
      }

      this.isLoading = true;
      this.isComplete = false;
      this.onComplete = onComplete;
      this.onTimeout = onTimeout;

      // 设置超时定时器
      this.timeoutTimer = setTimeout(() => {
        this.handleTimeout();
      }, this.config.maxWaitTime);

      // 创建 MutationObserver
      this.observer = new MutationObserver(this.handleMutation);

      // 选择观察的目标
      const target = this.config.targetSelector
        ? document.querySelector(this.config.targetSelector)
        : document.body;

      if (!target) {
        console.error("Target element not found");
        this.handleComplete();
        return;
      }

      // 开始观察
      this.observer.observe(target, {
        childList: true, // 观察子节点的添加/删除
        subtree: true, // 观察所有后代节点
        attributes: false, // 不观察属性变化
        characterData: false, // 不观察文本内容变化
      });

      // 初始化静默期定时器
      this.resetQuietTimer();

      // console.log("DynamicContentLoader started");
    }

    /**
     * 处理 DOM 变化
     */
    handleMutation() {
      if (this.isComplete) return;

      // 重置静默期定时器
      this.resetQuietTimer();
    }

    /**
     * 重置静默期定时器
     */
    resetQuietTimer() {
      // 清除之前的定时器
      if (this.quietTimer) {
        clearTimeout(this.quietTimer);
      }

      // 设置新的静默期定时器
      this.quietTimer = setTimeout(() => {
        this.handleComplete();
      }, this.config.quietPeriod);
    }

    /**
     * 处理加载完成
     */
    handleComplete() {
      if (this.isComplete) return;

      this.isComplete = true;
      this.isLoading = false;

      // 清理资源
      this.cleanup();

      // 触发完成回调
      if (this.onComplete) {
        this.onComplete();
      }

      console.log("DynamicContentLoader: Content loading complete");
    }

    /**
     * 处理超时
     */
    handleTimeout() {
      if (this.isComplete) return;

      console.warn("DynamicContentLoader: Maximum wait time reached");

      // 清理资源
      this.cleanup();

      // 触发超时回调
      if (this.onTimeout) {
        this.onTimeout();
      } else if (this.onComplete) {
        // 如果没有设置超时回调，仍然触发完成回调
        this.onComplete();
      }
    }

    /**
     * 清理资源
     */
    cleanup() {
      // 停止观察
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      // 清除定时器
      if (this.quietTimer) {
        clearTimeout(this.quietTimer);
        this.quietTimer = null;
      }

      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
      }
    }

    /**
     * 停止监听
     */
    stop() {
      if (!this.isLoading) return;

      this.cleanup();
      this.isLoading = false;
      this.isComplete = false;

      console.log("DynamicContentLoader stopped");
    }

    /**
     * 检查是否正在运行
     * @returns {boolean}
     */
    isRunning() {
      return this.isLoading;
    }

    /**
     * 检查是否已完成
     * @returns {boolean}
     */
    hasCompleted() {
      return this.isComplete;
    }

    /**
     * 重新配置（只能在未运行时调用）
     * @param {Object} newOptions 新配置
     */
    reconfigure(newOptions) {
      if (this.isLoading) {
        console.error("Cannot reconfigure while loader is running");
        return;
      }

      this.config = {
        ...this.config,
        ...newOptions,
      };
    }
  }

  /*********************************
   * Bootstrap
   *********************************/
  const launcher = new CCEditorLauncher([
    new ChubAdapter(),
    // new OtherSiteAdapter(),
  ]);

  const is_matched = () => launcher.adapters.some((a) => a.match());

  const fireOnce = async () => {
    // next tick
    await new Promise((resolve) => setTimeout(resolve));
    if (!is_matched()) return;
    const onLoad = new DynamicContentLoader();
    onLoad.start(() => {
      launcher.fire();
    });
  };

  const _historyWrap = function (type) {
    const orig = history[type];
    const e = new Event(type);
    return function () {
      const rv = orig.apply(this, arguments);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _historyWrap("pushState");
  history.replaceState = _historyWrap("replaceState");
  window.addEventListener("popstate", fireOnce);
  window.addEventListener("pushState", fireOnce);
  window.addEventListener("replaceState", fireOnce);
  window.addEventListener("hashchange", fireOnce);
  fireOnce();
})();

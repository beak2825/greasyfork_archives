// ==UserScript==
// @name         B站自动最高画质
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动选择B站视频/直播的最高可用分辨率
// @author       Benjia Zou
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553346/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553346/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    enabled: true,
    autoSelectAudio: true,  // 自动选择最高音质（杜比、Hi-Res）
    showNotification: true,  // 显示操作提示
    debug: false,            // 调试模式
  };

  // 日志系统
  const Logger = {
    log: (msg) => CONFIG.debug && console.log('[B站最高画质]', msg),
    info: (msg) => console.info('[B站最高画质]', msg),
    warn: (msg) => console.warn('[B站最高画质]', msg),
    error: (msg) => console.error('[B站最高画质]', msg),
  };

  // 页面类型检测
  const PAGE_TYPE = (() => {
    const url = window.location.href;
    if (url.includes('live.bilibili.com')) return 'LIVE';
    if (url.includes('/bangumi/')) return 'BANGUMI';
    if (url.includes('/video/')) return 'VIDEO';
    return 'UNKNOWN';
  })();

  // 通知系统
  const Notifier = {
    show: (msg, duration = 3000) => {
      if (!CONFIG.showNotification) return;

      const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        max-width: 300px;
        border-left: 3px solid #23aaff;
        animation: slideIn 0.3s ease-out;
      `;

      const notif = document.createElement('div');
      notif.innerHTML = msg;
      notif.style.cssText = style;

      const keyframes = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;

      if (!document.querySelector('#bilibili-auto-quality-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'bilibili-auto-quality-styles';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
      }

      document.body.appendChild(notif);

      setTimeout(() => {
        notif.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notif.remove(), 300);
      }, duration);
    },
  };

  // ============ 视频页面逻辑 ============
  const VideoQuality = {
    qualityMap: {
      16: '360P',
      32: '480P',
      64: '720P',
      74: '720P60',
      80: '1080P',
      112: '1080P+',
      116: '1080P60',
      120: '4K',
      125: 'HDR',
      126: '杜比视界',
      127: '8K',
    },

    // 获取品质标签文本
    getQualityName: (element) => {
      const badge = element.querySelector('.bpx-player-ctrl-quality-badge');
      const text = element.textContent.trim();
      return text || '未知';
    },

    // 检查是否为VIP限制
    isVIPOnly: (element) => {
      return element.querySelector('.bpx-player-ctrl-quality-badge-bigvip') !== null;
    },

    // 检查用户VIP状态
    isUserVIP: () => {
      // 方式1：检查VIP头像
      if (document.querySelector('.bili-avatar-icon-big-vip')) return true;

      // 方式2：检查是否能访问1080P+
      const qualityItems = document.querySelectorAll('.bpx-player-ctrl-quality-menu-item');
      for (const item of qualityItems) {
        if (item.textContent.includes('1080P+') &&
            !VideoQuality.isVIPOnly(item)) {
          return true;
        }
      }

      return false;
    },

    // 选择最高画质
    selectHighest: () => {
      const qualityMenu = document.querySelector('.bpx-player-ctrl-quality-menu');
      if (!qualityMenu) {
        Logger.log('未找到画质菜单');
        return false;
      }

      const qualityItems = Array.from(
        qualityMenu.querySelectorAll('.bpx-player-ctrl-quality-menu-item')
      );

      if (qualityItems.length === 0) {
        Logger.log('未找到画质选项');
        return false;
      }

      // 找到第一个可用的（最高的）画质
      let targetQuality = null;
      const isVIP = VideoQuality.isUserVIP();

      for (const item of qualityItems) {
        const isVIPOnly = VideoQuality.isVIPOnly(item);

        // 跳过VIP限制的项（非VIP用户）
        if (isVIPOnly && !isVIP) {
          Logger.log(`跳过VIP限制: ${VideoQuality.getQualityName(item)}`);
          continue;
        }

        targetQuality = item;
        break; // 第一个可用的就是最高的
      }

      if (!targetQuality) {
        Logger.log('没有可用的画质');
        return false;
      }

      const qualityName = VideoQuality.getQualityName(targetQuality);
      const isActive = targetQuality.classList.contains('bpx-state-active');

      if (!isActive) {
        Logger.log(`切换到: ${qualityName}`);
        targetQuality.click();
        Notifier.show(`✅ 已切换到 <strong>${qualityName}</strong> 画质`);
        return true;
      } else {
        Logger.log(`已在最高画质: ${qualityName}`);
        return true;
      }
    },

    // 选择最高音质
    selectHighestAudio: () => {
      // 杜比视界
      const dolbyBtn = document.querySelector('.bpx-player-ctrl-dolby');
      if (dolbyBtn && !dolbyBtn.classList.contains('bpx-state-active')) {
        dolbyBtn.click();
        Logger.log('已启用杜比视界');
        return true;
      }

      // Hi-Res
      const hiResBtn = document.querySelector('.bpx-player-ctrl-flac');
      if (hiResBtn && !hiResBtn.classList.contains('bpx-state-active')) {
        hiResBtn.click();
        Logger.log('已启用Hi-Res');
        return true;
      }

      return false;
    },

    // 自动选择逻辑
    auto: () => {
      if (!CONFIG.enabled) return false;

      let success = VideoQuality.selectHighest();

      if (CONFIG.autoSelectAudio) {
        const audioSuccess = VideoQuality.selectHighestAudio();
        success = success || audioSuccess;
      }

      return success;
    },
  };

  // ============ 直播页面逻辑 ============
  const LiveQuality = {
    qualityMap: {
      80: '流畅',
      150: '高清',
      250: '超清',
      400: '蓝光',
      10000: '原画',
      20000: '4K',
      30000: '杜比',
    },

    // 获取最高可用画质
    getHighestQuality: () => {
      try {
        const livePlayer = unsafeWindow.livePlayer;
        if (!livePlayer) {
          Logger.log('未找到直播播放器对象');
          return null;
        }

        const playerInfo = livePlayer.getPlayerInfo?.();
        if (!playerInfo || !playerInfo.qualityCandidates) {
          Logger.log('无法获取画质信息');
          return null;
        }

        // 找最高的qn值
        const qualities = playerInfo.qualityCandidates || [];
        if (qualities.length === 0) return null;

        const highest = Math.max(...qualities.map(q => q.qn));
        return highest;
      } catch (e) {
        Logger.error(`获取画质失败: ${e.message}`);
        return null;
      }
    },

    // 切换画质
    switchQuality: (qn) => {
      try {
        const livePlayer = unsafeWindow.livePlayer;
        if (!livePlayer) return false;

        livePlayer.switchQuality?.(qn);
        const qualityName = LiveQuality.qualityMap[qn] || `QN:${qn}`;
        Logger.log(`已切换直播画质到: ${qualityName}`);
        Notifier.show(`✅ 已切换到 <strong>${qualityName}</strong> 画质`);
        return true;
      } catch (e) {
        Logger.error(`切换画质失败: ${e.message}`);
        return false;
      }
    },

    // 自动选择逻辑
    auto: () => {
      if (!CONFIG.enabled) return false;

      const currentInfo = unsafeWindow.livePlayer?.getPlayerInfo?.();
      const highestQn = LiveQuality.getHighestQuality();

      if (!highestQn) {
        Logger.log('无法获取直播最高画质');
        return false;
      }

      // 已经是最高画质
      if (currentInfo?.quality === highestQn) {
        Logger.log(`已在最高直播画质: ${LiveQuality.qualityMap[highestQn]}`);
        return true;
      }

      // 切换到最高画质
      return LiveQuality.switchQuality(highestQn);
    },
  };

  // ============ 主控制器 ============
  const Controller = {
    // 重试策略：指数退避
    retrySelect: (selectFn, maxAttempts = 15) => {
      let attempts = 0;

      function attempt() {
        if (attempts >= maxAttempts) {
          Logger.warn(`在${maxAttempts}次尝试后放弃`);
          return;
        }

        try {
          const success = selectFn();
          if (success !== false) {
            Logger.log(`第${attempts + 1}次尝试成功`);
            return;
          }
        } catch (e) {
          Logger.error(`尝试${attempts + 1}失败: ${e.message}`);
        }

        // 指数退避
        const delay = Math.min(
          Math.pow(1.5, attempts) * 200,
          5000
        );

        attempts++;
        setTimeout(attempt, delay);
      }

      attempt();
    },

    // 初始化
    init: () => {
      Logger.info(`页面类型: ${PAGE_TYPE}`);

      if (PAGE_TYPE === 'LIVE') {
        // 直播页面：等待更久
        setTimeout(() => {
          Controller.retrySelect(() => LiveQuality.auto(), 15);
        }, 2000);
      } else if (PAGE_TYPE === 'VIDEO' || PAGE_TYPE === 'BANGUMI') {
        // 视频/番剧页面
        Controller.retrySelect(() => VideoQuality.auto(), 15);
      }
    },

    // 处理SPA导航
    setupNavigation: () => {
      let lastUrl = location.href;

      // 监听URL变化
      const checkUrlChange = () => {
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          Logger.info('页面已切换，重新初始化...');

          // 小延迟后重新初始化
          setTimeout(() => Controller.init(), 1000);
        }
      };

      // 监听路由变化
      window.addEventListener('popstate', checkUrlChange);
      setInterval(checkUrlChange, 1000);

      // 监听hash变化（番剧）
      window.addEventListener('hashchange', () => {
        Logger.info('Hash已变化，重新初始化...');
        setTimeout(() => Controller.init(), 1000);
      });
    },
  };

  // ============ 启动 ============
  (function startup() {
    Logger.info('脚本已加载');

    // 加载配置
    if (typeof GM_getValue !== 'undefined') {
      CONFIG.enabled = GM_getValue('bilibili_auto_quality_enabled', true);
      CONFIG.autoSelectAudio = GM_getValue('bilibili_auto_quality_audio', true);
      CONFIG.showNotification = GM_getValue('bilibili_auto_quality_notify', true);
      CONFIG.debug = GM_getValue('bilibili_auto_quality_debug', false);
    }

    // 初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => Controller.init(), 500);
      });
    } else {
      setTimeout(() => Controller.init(), 500);
    }

    // 设置导航监听
    Controller.setupNavigation();

    // 暴露控制接口（开发者工具用）
    if (!unsafeWindow.BilibiliAutoQuality) {
      unsafeWindow.BilibiliAutoQuality = {
        CONFIG,
        selectVideo: () => VideoQuality.selectHighest(),
        selectLive: () => LiveQuality.auto(),
        setEnabled: (val) => { CONFIG.enabled = val; },
        setDebug: (val) => { CONFIG.debug = val; },
      };
      Logger.info('开发者接口已暴露: window.BilibiliAutoQuality');
    }
  })();
})();

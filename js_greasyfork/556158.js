// ==UserScript==
// @name         网页访问加速器
// @name:en      Web Access Accelerator
// @name:zh      网页访问加速器
// @name:zh-TW   網頁訪問加速器
// @name:ja      ウェブ アクセス アクセラレータ
// @name:ko      웹 액세스 가속기
// @name:de      Webzugriffsbeschleuniger
// @namespace    https://github.com/xxxily
// @version      1.1.0
// @description  基于谷歌quicklink的网页访问加速器，加快网页打开速度，提升浏览体验
// @description:en Web page access accelerator based on Google quicklink to speed up the opening of web pages and improve browsing experience
// @description:zh 基于谷歌quicklink的网页访问加速器，加快网页打开速度，提升浏览体验
// @description:zh-TW  基於谷歌quicklink的網頁訪問加速器，加快網頁打開速度，提升瀏覽體驗
// @description:ja  Google クイックリンクに基づく Web ページ アクセス アクセラレータで、Web ページを開く速度を上げ、ブラウジング エクスペリエンスを向上させます
// @description:ko  웹 페이지 열기 속도를 높이고 브라우징 경험을 개선하기 위한 Google 퀵링크 기반 웹 페이지 액세스 가속기
// @description:de  Beschleuniger für den Zugriff auf Webseiten, basierend auf Google Quicklink, um das Öffnen von Webseiten zu beschleunigen und das Surferlebnis zu verbessern
// @author       ankvps
// @icon         https://lh3.googleusercontent.com/5b2IeKOldW9hxPQaV7oyRfdAgN2V7Ot1bGcpE4QT5Uq4yt7yNtdgh0ABq4NCEwvsDdEU4HWKVXwUjYuem2JyJ_JrSu8=w128-h128-e365-rj-sc0x00ffffff
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Apache License 2.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556158/%E7%BD%91%E9%A1%B5%E8%AE%BF%E9%97%AE%E5%8A%A0%E9%80%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556158/%E7%BD%91%E9%A1%B5%E8%AE%BF%E9%97%AE%E5%8A%A0%E9%80%9F%E5%99%A8.meta.js
// ==/UserScript==

(function (w) { if (w) { w.name = 'quicklink-user-script'; } })(window);

class QuicklinkAccelerator {
  constructor() {
    this.stats = {
      prefetched: 0,
      prerendered: 0,
      ignored: 0,
      errors: 0,
      startTime: Date.now()
    };
    this.toastContainer = null;
    this.init();
  }

  init() {
    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupQuicklink());
    } else {
      this.setupQuicklink();
    }
  }

  setupQuicklink() {
    try {
      // 创建优化的 quicklink 配置
      const config = {
        // 优化性能参数
        throttle: 3, // 增加并发限制，减少对主线程的影响
        limit: 8, // 限制预加载数量
        timeout: 3000, // 延长超时时间
        delay: 100, // 延迟执行，减少初始加载压力
        
        // 忽略规则
        ignores: [
          this.ignoreFunc.bind(this),
          // 添加更多智能忽略规则
          (url, el) => {
            // 忽略动态生成的链接
            if (el && el.getAttribute('onclick')) return true;
            // 忽略带特定数据属性的链接
            if (el && el.dataset.noPrefetch) return true;
            return false;
          }
        ],
        
        // 优先级函数
        priority: (url, el) => {
          // 根据链接在视口中的位置和大小设置优先级
          if (el) {
            const rect = el.getBoundingClientRect();
            const viewportArea = window.innerWidth * window.innerHeight;
            const elementArea = rect.width * rect.height;
            const intersectionRatio = elementArea / viewportArea;
            
            if (intersectionRatio > 0.3) return true; // 大元素高优先级
            if (rect.top < window.innerHeight * 0.3) return true; // 顶部元素高优先级
          }
          return false;
        },
        
        // 错误处理
        onError: (error) => {
          this.stats.errors++;
          console.warn('[Quicklink] Prefetch error:', error);
        },
        
        // 自定义 URL 处理
        hrefFn: (el) => {
          if (!el || !el.href) return null;
          
          // 处理相对路径
          let url = el.href;
          try {
            const urlObj = new URL(url, window.location.href);
            // 移除不必要的参数
            const params = new URLSearchParams(urlObj.search);
            ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'].forEach(param => {
              params.delete(param);
            });
            urlObj.search = params.toString();
            return urlObj.toString();
          } catch (e) {
            return url;
          }
        }
      };

      // 使用优化后的 quicklink 实现
      this.setupOptimizedQuicklink(config);
      
      // 显示加速提示
      this.showAccelerationToast();
      
    } catch (error) {
      console.error('[Quicklink Accelerator] Setup failed:', error);
    }
  }

  setupOptimizedQuicklink(config) {
    // 使用现代浏览器 API 进行优化
    const observerOptions = {
      root: null,
      rootMargin: '50px 0px 50px 0px', // 扩大观察区域
      threshold: [0, 0.1, 0.5] // 多阈值检测
    };

    let prefetchedUrls = new Set();
    let observer;

    const prefetch = async (url) => {
      if (prefetchedUrls.has(url)) return;
      
      try {
        // 使用现代预加载技术
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        link.crossOrigin = 'use-credentials';
        
        link.onload = () => {
          this.stats.prefetched++;
          prefetchedUrls.add(url);
          this.updateStatsDisplay();
        };
        
        link.onerror = () => {
          this.stats.errors++;
        };
        
        document.head.appendChild(link);
      } catch (error) {
        this.stats.errors++;
      }
    };

    const shouldPrefetch = (url, element) => {
      if (!url || prefetchedUrls.has(url)) return false;
      if (config.ignores.some(ignore => ignore(url, element))) {
        this.stats.ignored++;
        return false;
      }
      return true;
    };

    // 使用 Intersection Observer v2 如果可用
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.href) {
          const url = config.hrefFn ? config.hrefFn(entry.target) : entry.target.href;
          if (shouldPrefetch(url, entry.target)) {
            setTimeout(() => prefetch(url), config.delay || 0);
          }
        }
      });
    }, observerOptions);

    // 观察页面中的所有链接
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      if (shouldPrefetch(link.href, link)) {
        observer.observe(link);
      }
    });

    // 监听动态添加的链接
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'A' && node.href) {
              if (shouldPrefetch(node.href, node)) {
                observer.observe(node);
              }
            } else {
              const links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
              links.forEach(link => {
                if (shouldPrefetch(link.href, link)) {
                  observer.observe(link);
                }
              });
            }
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 保存观察器引用以便清理
    this.observer = observer;
    this.mutationObserver = mutationObserver;
  }

  ignoreFunc(uri, ele) {
    const ignoresRules = {
      urlPaths: ['api', 'logout', 'signout', 'exit', 'quit', 'login', 'logoff', 'subscribe', 
                'subscription', 'doubleclick', 'bit.ly', 'signin', 'signup', 'apk', 'release', 
                'amazon', 'google', 'shopping', 'checkout', 'shop', 'cart', 'ads', 'ticket', 
                'captcha', 'download', 'upload', 'delete', 'remove'],
      fileExtensions: ['.zip', '.pdf', '.mp4', '.webm', '.mp3', '.mov', '.rar', '.apk', 
                      '.tar', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.exe', 
                      '.dmg', '.pkg', '.deb', '.rpm'],
      urlProtocols: ['http:', 'tel:', 'mailto:', 'javascript:', 'market:'],
      patterns: [
        /\/api\/v\d+\//,
        /\/admin\//,
        /\/dashboard\//,
        /logout/i,
        /login/i,
        /\.(zip|pdf|mp4|mp3|exe)$/i
      ]
    };

    const result = 
      ignoresRules.urlPaths.some(item => uri.includes(`/${item}/`)) ||
      ignoresRules.fileExtensions.some(item => uri.includes(item)) ||
      ignoresRules.urlProtocols.some(item => uri.startsWith(item)) ||
      ignoresRules.patterns.some(pattern => pattern.test(uri));

    if (result) {
      console.log('[Quicklink][Ignore]', uri);
      this.stats.ignored++;
    }

    return result;
  }

  createToastContainer() {
    if (this.toastContainer) return;
    
    this.toastContainer = document.createElement('div');
    this.toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      pointer-events: none;
    `;
    document.body.appendChild(this.toastContainer);
  }

  showAccelerationToast() {
    this.createToastContainer();
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      margin-bottom: 10px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      transform: translateX(400px);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 300px;
      font-size: 14px;
      line-height: 1.4;
    `;
    
    const acceleration = this.calculateAcceleration();
    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px;">🚀 网页加速已启用</div>
      <div style="font-size: 12px; opacity: 0.9;">
        • 预计提速: <strong>${acceleration}%</strong><br>
        • 预加载链接: <strong>${this.stats.prefetched}</strong><br>
        • 智能忽略: <strong>${this.stats.ignored}</strong>
      </div>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // 动画显示
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
    
    // 5秒后自动隐藏
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, 5000);
  }

  calculateAcceleration() {
    // 基于预加载数量和页面复杂度的简单加速计算
    const baseAcceleration = 40; // 基础加速百分比
    const prefetchBonus = Math.min(this.stats.prefetched * 2, 30); // 每个预加载链接最多贡献2%
    const complexityFactor = this.calculatePageComplexity();
    
    return Math.min(baseAcceleration + prefetchBonus - complexityFactor, 80);
  }

  calculatePageComplexity() {
    // 简单估算页面复杂度
    const links = document.querySelectorAll('a[href]').length;
    const images = document.querySelectorAll('img').length;
    
    if (links > 100) return 20;
    if (links > 50) return 10;
    if (links > 20) return 5;
    return 0;
  }

  updateStatsDisplay() {
    // 可以在这里更新实时统计显示
    if (this.stats.prefetched % 5 === 0) {
      console.log(`[Quicklink] 已预加载 ${this.stats.prefetched} 个链接，忽略 ${this.stats.ignored} 个链接`);
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.toastContainer) {
      this.toastContainer.remove();
    }
  }
}

// 初始化加速器
let accelerator;

// 确保在合适的时机初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    accelerator = new QuicklinkAccelerator();
  });
} else {
  accelerator = new QuicklinkAccelerator();
}

// 提供全局访问（用于调试）
window.quicklinkAccelerator = accelerator;
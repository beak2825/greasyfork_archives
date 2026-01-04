// ==UserScript==
// @name         Slider Auto Verification
// @namespace    https://www.goofish.com/
// @version      5.0
// @description  智能ET指纹滑块自动验证，支持多种ET检测策略，智能检测失败并自动刷新重试
// @match        https://*.goofish.com/*
// @run-at       document-start
// @grant        none
// @license MIT  
// @downloadURL https://update.greasyfork.org/scripts/552534/Slider%20Auto%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/552534/Slider%20Auto%20Verification.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SLIDER_SELECTOR = '.btn_slide, #nc_1_n1z, [class*="btn_slide"], [id*="nc_1_n1z"]';
  const PROMPT_TEXT = '亲，请拖动下方滑块完成验证';
  const ERROR_SELECTOR = '.errloading, .errload, .nc_err, [id*="refresh"], .errloading [id*="refresh"]';
  const CHECK_INTERVAL = 800;
  const ET_TIMEOUT = 15000;
  const VERIFY_CHECK_DELAY = 4000; // 滑动后等待4秒检查是否成功
  const MAX_RETRY_COUNT = 10; // 最大重试次数，防止无限刷新

  const processedSliders = new WeakSet();
  let etDetectionStrategy = 'auto'; // auto, strict, bypass
  let lastSlideTime = 0;
  let retryCount = 0;
  let isVerifying = false; // 防止重复验证

  // 从localStorage读取重试次数
  const getRetryCount = () => {
    try {
      return parseInt(localStorage.getItem('et_slider_retry_count') || '0', 10);
    } catch (e) {
      return 0;
    }
  };

  // 保存重试次数
  const setRetryCount = (count) => {
    try {
      localStorage.setItem('et_slider_retry_count', count.toString());
    } catch (e) {
      console.warn('[Smart ET] 无法保存重试次数');
    }
  };

  // 清除重试次数
  const clearRetryCount = () => {
    try {
      localStorage.removeItem('et_slider_retry_count');
    } catch (e) {
      console.warn('[Smart ET] 无法清除重试次数');
    }
  };

  // 初始化重试计数
  retryCount = getRetryCount();

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 多种ET检测策略
  const etDetectionStrategies = {
    // 严格模式：等待所有ET指标就绪
    strict: () => {
      return !!(window.etSign &&
        window.__awsc_et__ &&
        typeof window.__awsc_et__.getFN === 'function' &&
        typeof window.__awsc_et__.getETToken === 'function');
    },

    // 宽松模式：部分ET指标就绪即可
    loose: () => {
      return !!(window.etSign ||
        (window.__awsc_et__ &&
          (typeof window.__awsc_et__.getFN === 'function' ||
           typeof window.__awsc_et__.getETToken === 'function')));
    },

    // 绕过模式：不检测ET，直接尝试
    bypass: () => true,

    // 自动模式：根据浏览器和页面状态选择策略
    auto: () => {
      const isEdge = navigator.userAgent.includes('Edg');
      const isChrome = navigator.userAgent.includes('Chrome');

      // Edge浏览器使用绕过模式
      if (isEdge) return true;

      // Chrome浏览器使用宽松模式
      if (isChrome) return etDetectionStrategies.loose();

      // 其他情况使用严格模式
      return etDetectionStrategies.strict();
    }
  };

  // 智能ET检测
  const waitForET = async (strategy = 'auto') => {
    const start = Date.now();
    const detector = etDetectionStrategies[strategy] || etDetectionStrategies.auto;

    console.log(`[Smart ET] 使用检测策略: ${strategy}`);

    while (Date.now() - start < ET_TIMEOUT) {
      if (detector()) {
        console.log(`[Smart ET] ET就绪 (${strategy}模式)`);
        return true;
      }

      // 动态调整策略
      if (strategy === 'auto' && Date.now() - start > 5000) {
        console.log('[Smart ET] 超时，切换到绕过模式');
        return true;
      }

      await wait(200);
    }

    console.warn(`[Smart ET] ET检测超时 (${strategy}模式)`);
    return false;
  };

  // 增强的滑块检测
  const findSlider = () => {
    // 主页面检测
    let slider = document.querySelector(SLIDER_SELECTOR);
    if (slider) return slider;

    // iframe检测
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        if (iframe.contentDocument) {
          slider = iframe.contentDocument.querySelector(SLIDER_SELECTOR);
          if (slider) return slider;
        }
      } catch (e) {
        // 跨域iframe
      }
    }

    return null;
  };

  // 检查验证界面
  const hasVerificationUI = () => {
    // 检查提示文本
    const hasPrompt = document.body && document.body.textContent.includes(PROMPT_TEXT);

    // 检查滑块元素
    const hasSlider = findSlider() !== null;

    // 检查验证相关元素
    const hasVerificationElements = document.querySelectorAll(
      '[class*="captcha"], [class*="verify"], [class*="slider"], [class*="nc_"]'
    ).length > 0;

    return hasPrompt || hasSlider || hasVerificationElements;
  };

  // 检测错误状态（验证失败）
  const hasErrorState = () => {
    const errorElements = document.querySelectorAll(ERROR_SELECTOR);

    // 检查是否有可见的错误元素
    for (const elem of errorElements) {
      if (elem.offsetParent !== null) {
        console.log('[Smart ET] 检测到错误状态元素:', elem.className || elem.id);
        return true;
      }
    }

    // 检查错误相关的文本
    const errorTexts = ['验证失败', '加载失败', '请刷新', '重试'];
    const bodyText = document.body ? document.body.textContent : '';
    for (const errorText of errorTexts) {
      if (bodyText.includes(errorText)) {
        console.log('[Smart ET] 检测到错误文本:', errorText);
        return true;
      }
    }

    return false;
  };

  // 检查验证是否成功（滑块消失且无错误）
  const isVerificationSuccessful = () => {
    const hasUI = hasVerificationUI();
    const hasError = hasErrorState();

    // 成功：验证界面消失且没有错误
    return !hasUI && !hasError;
  };

  // 检查验证是否失败（有错误或滑块还在）
  const isVerificationFailed = () => {
    const hasError = hasErrorState();
    const hasUI = hasVerificationUI();

    // 失败：显示错误 或 滑块仍然存在
    return hasError || hasUI;
  };

  // 刷新页面重试
  const refreshAndRetry = () => {
    retryCount++;
    setRetryCount(retryCount);

    if (retryCount >= MAX_RETRY_COUNT) {
      console.error(`[Smart ET] 已达到最大重试次数 (${MAX_RETRY_COUNT})，停止自动刷新`);
      alert(`滑块验证失败次数过多 (${MAX_RETRY_COUNT}次)，请手动处理`);
      clearRetryCount();
      return;
    }

    console.log(`[Smart ET] ❌ 验证失败，准备刷新页面重试 (第 ${retryCount} 次)`);

    // 延迟刷新，给用户看到状态的时间
    setTimeout(() => {
      console.log('[Smart ET] 正在刷新页面...');
      location.reload();
    }, 1500);
  };

  // 验证滑动结果
  const verifySlideResult = async () => {
    if (isVerifying) {
      console.log('[Smart ET] 已有验证进程在运行，跳过');
      return;
    }

    isVerifying = true;
    console.log('[Smart ET] 等待验证结果...');

    // 分段检查，更快发现错误
    for (let i = 0; i < 4; i++) {
      await wait(VERIFY_CHECK_DELAY / 4);

      // 提前检测错误状态
      if (hasErrorState()) {
        console.warn('[Smart ET] ❌ 检测到验证错误状态');
        isVerifying = false;
        refreshAndRetry();
        return false;
      }

      // 提前检测成功
      if (isVerificationSuccessful()) {
        console.log('[Smart ET] ✅ 验证成功！滑块已消失');
        clearRetryCount();
        isVerifying = false;
        return true;
      }
    }

    // 最终检查
    if (isVerificationSuccessful()) {
      console.log('[Smart ET] ✅ 验证成功！滑块已消失');
      clearRetryCount();
      isVerifying = false;
      return true;
    } else if (isVerificationFailed()) {
      console.warn('[Smart ET] ❌ 验证失败，滑块仍然存在或出现错误');
      isVerifying = false;
      refreshAndRetry();
      return false;
    }

    isVerifying = false;
    return false;
  };

  // 浏览器特定的滑动实现
  const createSliderImplementation = () => {
    const isEdge = navigator.userAgent.includes('Edg');

    if (isEdge) {
      // Edge浏览器：简化实现
      return async (slider) => {
        console.log('[Smart ET] 使用Edge简化滑动');

        const track = slider.closest('.nc_btn') || slider.parentElement;
        const trackRect = track.getBoundingClientRect();
        const sliderRect = slider.getBoundingClientRect();

        const startX = sliderRect.left + sliderRect.width / 2;
        const startY = sliderRect.top + sliderRect.height / 2;
        const travel = Math.max(0, trackRect.width - sliderRect.width - 2);

        // 直接设置位置
        slider.style.left = travel + 'px';

        // 发送必要的事件
        const events = [
          new MouseEvent('mousedown', { clientX: startX, clientY: startY, button: 0, buttons: 1 }),
          new MouseEvent('mousemove', { clientX: startX + travel, clientY: startY, button: 0, buttons: 1 }),
          new MouseEvent('mouseup', { clientX: startX + travel, clientY: startY, button: 0, buttons: 0 })
        ];

        events.forEach((event, index) => {
          setTimeout(() => {
            if (index === 0) slider.dispatchEvent(event);
            else document.dispatchEvent(event);
          }, index * 50);
        });
      };
    } else {
      // Chrome等浏览器：复杂实现
      return async (slider) => {
        console.log('[Smart ET] 使用Chrome复杂滑动');

        const track = slider.closest('.nc_btn') || slider.parentElement;
        const trackRect = track.getBoundingClientRect();
        const sliderRect = slider.getBoundingClientRect();

        const startX = sliderRect.left + sliderRect.width / 2;
        const startY = sliderRect.top + sliderRect.height / 2;
        const travel = Math.max(0, trackRect.width - sliderRect.width - 2);

        const steps = 50 + Math.floor(Math.random() * 20);
        const duration = 2000 + Math.random() * 1000;

        // 缓动函数
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // 鼠标按下
        const mouseDown = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          clientX: startX,
          clientY: startY,
          button: 0,
          buttons: 1
        });
        slider.dispatchEvent(mouseDown);

        await wait(100);

        // 逐步移动
        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          const progress = easeInOutCubic(t);
          const currentX = startX + travel * progress;
          const currentY = startY + (Math.random() - 0.5) * 2;

          const mouseMove = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: currentX,
            clientY: currentY,
            button: 0,
            buttons: 1
          });

          slider.dispatchEvent(mouseMove);
          await wait(duration / steps);
        }

        // 鼠标释放
        const mouseUp = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: startX + travel,
          clientY: startY,
          button: 0,
          buttons: 0
        });
        document.dispatchEvent(mouseUp);
      };
    }
  };

  // 智能滑动执行
  const executeSmartSlide = async (slider) => {
    const slideImplementation = createSliderImplementation();

    try {
      await slideImplementation(slider);
      console.log('[Smart ET] 滑动执行完成');
      lastSlideTime = Date.now();

      // 验证滑动结果
      await verifySlideResult();
    } catch (error) {
      console.error('[Smart ET] 滑动执行失败:', error);
      isVerifying = false;
      refreshAndRetry();
    }
  };

  // 主要的自动滑动逻辑
  const tryAutoSlide = async () => {
    // 如果正在验证中，不要重复处理
    if (isVerifying) {
      return;
    }

    // 如果最近刚滑动过，等待验证
    if (lastSlideTime && Date.now() - lastSlideTime < VERIFY_CHECK_DELAY + 1000) {
      return;
    }

    // 先检查是否有错误状态（可能是页面刷新后的残留）
    if (hasErrorState() && !hasVerificationUI()) {
      console.log('[Smart ET] 检测到孤立的错误状态，可能需要刷新');
      return;
    }

    if (!hasVerificationUI()) {
      console.debug('[Smart ET] 未检测到验证界面');
      return;
    }

    const slider = findSlider();
    if (!slider || processedSliders.has(slider)) {
      return;
    }

    console.log('[Smart ET] 检测到滑块，开始处理');

    // 根据策略检测ET
    const etReady = await waitForET(etDetectionStrategy);
    if (!etReady) {
      console.warn('[Smart ET] ET未就绪，但继续尝试滑动');
    }

    processedSliders.add(slider);

    // 延迟执行滑动
    await wait(1000 + Math.random() * 500);

    requestAnimationFrame(() => {
      executeSmartSlide(slider);
    });
  };

  // DOM变化监听
  const setupMutationObserver = () => {
    const observer = new MutationObserver((mutations) => {
      let shouldReset = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches && node.matches(SLIDER_SELECTOR)) {
                shouldReset = true;
              }
              if (node.querySelector && node.querySelector(SLIDER_SELECTOR)) {
                shouldReset = true;
              }
            }
          });
        }
      });

      if (shouldReset) {
        processedSliders.clear();
        isVerifying = false;
        console.log('[Smart ET] 检测到新滑块，重置处理状态');
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  // 调试信息
  const logDebugInfo = () => {
    console.log('[Smart ET] 调试信息:');
    console.log('- 浏览器:', navigator.userAgent.includes('Edg') ? 'Edge' : 'Chrome/Other');
    console.log('- 滑块数量:', document.querySelectorAll(SLIDER_SELECTOR).length);
    console.log('- iframe数量:', document.querySelectorAll('iframe').length);
    console.log('- 验证界面:', hasVerificationUI());
    console.log('- 错误状态:', hasErrorState());
    console.log('- 当前重试次数:', retryCount);
    console.log('- ET状态:', {
      etSign: !!window.etSign,
      awsc_et: !!window.__awsc_et__,
      getFN: !!(window.__awsc_et__ && typeof window.__awsc_et__.getFN === 'function'),
      getETToken: !!(window.__awsc_et__ && typeof window.__awsc_et__.getETToken === 'function')
    });
  };

  // 初始化
  const init = () => {
    console.log('[Smart ET] 智能ET滑块脚本启动 (v5.0 - 智能错误检测)');

    if (retryCount > 0) {
      console.log(`[Smart ET] 检测到之前的重试记录 (第 ${retryCount} 次尝试)`);
    }

    setupMutationObserver();
    logDebugInfo();

    // 立即尝试一次
    setTimeout(() => {
      logDebugInfo();
      tryAutoSlide().catch(err => console.error('[Smart ET] 初始检测错误:', err));
    }, 2000);

    // 定期检查
    setInterval(() => {
      tryAutoSlide().catch(err => console.error('[Smart ET] 定期检测错误:', err));
    }, CHECK_INTERVAL);
  };

  // 启动脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
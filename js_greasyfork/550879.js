// ==UserScript==
// @name         中燃WMS二维码生成器
// @namespace    https://wms.chinagasholdings.com
// @version      2.1.0
// @description  获取页面信息并生成可拖拽的悬浮二维码
// @author       intpfx
// @match        https://wms.chinagasholdings.com/logincenter/wms_workplace
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550879/%E4%B8%AD%E7%87%83WMS%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550879/%E4%B8%AD%E7%87%83WMS%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 全局变量
  let isDragging = false;
  let offsetX, offsetY;
  let qrcodeLib = null; // 存储QRCode库的引用
  let isMinimized = false; // 记录是否处于最小化状态
  let fontAwesomeLoaded = false; // 记录font-awesome是否已加载

  // 【关键】判断哈希值是否匹配目标 #A3001
  function isTargetUrl() {
    return window.location.hash === '#A3001';
  }

  // 动态导入font-awesome
  async function loadFontAwesome() {
    if (fontAwesomeLoaded) return;

    try {
      // 检查是否已加载
      if (document.querySelector('link[href*="font-awesome.min.css"]')) {
        fontAwesomeLoaded = true;
        return;
      }

      // 使用esm.sh导入font-awesome
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://esm.sh/font-awesome@4.7.0/css/font-awesome.min.css';

      // 返回Promise等待加载完成
      return new Promise((resolve, reject) => {
        link.onload = () => {
          fontAwesomeLoaded = true;
          resolve();
        };
        link.onerror = (error) => {
          console.error('font-awesome加载失败:', error);
          reject(new Error('图标库加载失败'));
        };
        document.head.appendChild(link);
      });
    } catch (error) {
      console.error('加载font-awesome时出错:', error);
      throw error;
    }
  }

  // 导入QRCode库
  async function importQRCode() {
    if (qrcodeLib) return qrcodeLib;

    try {
      const { qrcode } = await import('https://esm.sh/jsr/@libs/qrcode');
      qrcodeLib = qrcode;
      return qrcode;
    } catch (error) {
      console.error('JSR包导入失败:', error);
      showNotification('二维码库加载失败，请检查网络', 'error');
      throw error;
    }
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    // 检查是否已有通知
    let notification = document.getElementById('qrcode-notification');
    if (notification) {
      notification.remove();
    }

    notification = document.createElement('div');
    notification.id = 'qrcode-notification';
    notification.className = `qrcode-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // 3秒后自动消失
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // 创建悬浮窗和通知样式
  function createStyles() {
    GM_addStyle(`
            #qrcode-floating-window {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 2px solid #3498db;
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 999999;
                cursor: move;
                transition: all 0.3s ease;
                min-width: 250px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #qrcode-floating-window:hover {
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                border-color: #2980b9;
            }

            #qrcode-header {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-bottom: 10px;
            }

            .qrcode-btn {
                background: #f1f5f9;
                color: #3498db;
                border: none;
                border-radius: 5px;
                width: 30px;
                height: 30px;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .qrcode-btn:hover {
                background: #3498db;
                color: white;
            }

            #qrcode-container {
                display: flex;
                justify-content: center;
                margin-bottom: 15px;
                width: 200px;
                height: 200px;
            }

            #qrcode-info {
                font-size: 14px;
                color: #333;
                text-align: center;
                line-height: 1.6;
                max-height: 100px;
                overflow-y: auto;
                width: 100%;
            }

            .qrcode-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 5px;
                color: white;
                z-index: 999999;
                transition: opacity 0.3s;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }

            .qrcode-notification.info {
                background: #3498db;
            }

            .qrcode-notification.success {
                background: #2ecc71;
            }

            .qrcode-notification.error {
                background: #e74c3c;
            }

            /* 最小化样式 */
            #qrcode-floating-window.minimized {
                min-width: auto;
                padding: 8px;
            }

            #qrcode-floating-window.minimized #qrcode-container,
            #qrcode-floating-window.minimized #qrcode-info {
                display: none;
            }

            .error-message {
                color: #e74c3c;
                text-align: center;
                padding: 20px;
                width: 100%;
                box-sizing: border-box;
            }
        `);
  }

  // 获取页面信息
  function getPageInfo() {
    try {
      // 找到页面中id为A3001S05_ALLOCheaderMainForm的表单
      const form = document.querySelector('#A3001S05_ALLOCheaderMainForm');

      if (!form) {
        throw new Error('未找到表单元素A3001S05_ALLOCheaderMainForm');
      }

      // 封装获取输入值的函数，增加错误处理
      const getInputValue = (name, alias) => {
        const input = form.querySelector(`input[name="${name}"]`);
        if (!input) {
          console.warn(`未找到名为${name}的输入框`);
          return `无${alias}信息`;
        }
        return input.value || `无${alias}信息`;
      };

      return {
        supplierName: getInputValue('lotAtt04','供应商名称'),
        sku: getInputValue('sku','物料编码'),
        dop: getInputValue('lotAtt01','生产日期'),
        batch: getInputValue('lotAtt05','生产批次'),
      };
    } catch (error) {
      console.error('获取页面信息失败:', error);
      showNotification('获取信息失败: ' + error.message, 'error');
      // 返回默认值，确保功能可以继续运行
      return {
        supplierName: '暂无数据',
        sku: '暂无数据',
        dop: '暂无数据',
        batch: '暂无数据',
      };
    }
  }

  // 生成二维码内容
  function generateQRContent(pageInfo) {
    return `供应商名称：${pageInfo.supplierName}\n物料编码：${pageInfo.sku}\n生产日期：${pageInfo.dop}\n生产批次：${pageInfo.batch}`;
  }

  // 创建悬浮窗
  function createFloatingWindow() {
    // 检查是否已有悬浮窗
    const existingWindow = document.getElementById('qrcode-floating-window');
    if (existingWindow) {
      existingWindow.remove();
    }

    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'qrcode-floating-window';

    // 尝试从存储中获取位置
    const savedPosition = GM_getValue('qrcodeWindowPosition');
    if (savedPosition) {
      floatingWindow.style.left = savedPosition.left;
      floatingWindow.style.top = savedPosition.top;
      floatingWindow.style.transform = 'none';
    }

    // 按钮头部容器
    const header = document.createElement('div');
    header.id = 'qrcode-header';
    floatingWindow.appendChild(header);

    // 刷新按钮（使用图标）
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'qrcode-btn';
    refreshBtn.innerHTML = '<i class="fa fa-refresh"></i>';
    refreshBtn.title = '刷新二维码';
    refreshBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); // 防止触发拖拽
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
      try {
        await updateQRCode();
        showNotification('二维码已更新', 'success');
      } catch (error) {
        showNotification('更新失败', 'error');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fa fa-refresh"></i>';
      }
    });
    header.appendChild(refreshBtn);

    // 缩小按钮（使用图标）
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'qrcode-btn';
    minimizeBtn.innerHTML = '<i class="fa fa-compress"></i>';
    minimizeBtn.title = '最小化';
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止触发拖拽
      isMinimized = !isMinimized;
      if (isMinimized) {
        floatingWindow.classList.add('minimized');
        minimizeBtn.innerHTML = '<i class="fa fa-expand"></i>';
        minimizeBtn.title = '恢复';
      } else {
        floatingWindow.classList.remove('minimized');
        minimizeBtn.innerHTML = '<i class="fa fa-compress"></i>';
        minimizeBtn.title = '最小化';
      }
    });
    header.appendChild(minimizeBtn);

    // 二维码容器
    const qrcodeContainer = document.createElement('div');
    qrcodeContainer.id = 'qrcode-container';
    floatingWindow.appendChild(qrcodeContainer);

    // 信息显示
    const infoDiv = document.createElement('div');
    infoDiv.id = 'qrcode-info';
    floatingWindow.appendChild(infoDiv);

    document.body.appendChild(floatingWindow);
    return floatingWindow;
  }

  // 更新二维码
  async function updateQRCode() {
    if (!qrcodeLib) {
      qrcodeLib = await importQRCode();
    }

    const pageInfo = getPageInfo();
    const qrContent = generateQRContent(pageInfo);

    // 更新信息显示
    const infoDiv = document.getElementById('qrcode-info');
    if (infoDiv) {
      infoDiv.innerHTML = `
        <div>供应商名称: ${pageInfo.supplierName.length > 20 ? pageInfo.supplierName.substring(0, 20) + '...' : pageInfo.supplierName}</div>
        <div>物料编码: ${pageInfo.sku}</div>
        <div>生产日期: ${pageInfo.dop}</div>
        <div>生产批次: ${pageInfo.batch}</div>
      `;
    }

    // 生成二维码
    const qrcodeContainer = document.getElementById('qrcode-container');
    if (!qrcodeContainer) {
      throw new Error('二维码容器不存在');
    }

    // 清除现有内容
    qrcodeContainer.innerHTML = '';

    try {
      // 生成SVG格式的二维码
      let svg = qrcodeLib(qrContent, { output: "svg" });

      // 验证SVG内容是否有效
      if (typeof svg !== 'string' || svg.trim() === '') {
        throw new Error("生成的SVG内容为空或无效");
      }

      // 将svg字符串里的viewBox更改为"0 0 52 52"
      svg = svg.replace(/viewBox="0 0 \d+ \d+"/, 'viewBox="0 0 52 52"');

      // 创建临时容器解析SVG
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = svg;

      // 尝试获取SVG元素
      let svgElement = tempContainer.querySelector('svg');

      // 如果直接解析失败，尝试使用DOMParser
      if (!svgElement) {
        const parser = new DOMParser();
        try {
          const doc = parser.parseFromString(svg, "image/svg+xml");
          // 检查解析错误
          const parserError = doc.querySelector('parsererror');
          if (parserError) {
            throw new Error("SVG解析错误: " + parserError.textContent);
          }
          svgElement = doc.documentElement;
        } catch (parseError) {
          console.error('DOMParser解析失败:', parseError);
          throw new Error("无法解析SVG内容");
        }
      }

      if (svgElement && svgElement.tagName.toLowerCase() === 'svg') {
        // 清除可能的事件监听器和不需要的属性
        svgElement.removeAttribute('onload');
        svgElement.removeAttribute('onerror');

        // 添加到容器
        qrcodeContainer.appendChild(svgElement);
      } else {
        throw new Error("生成的内容不是有效的SVG元素");
      }
    } catch (error) {
      console.error('生成二维码失败:', error);
      // 创建错误信息元素
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = '二维码生成失败';
      qrcodeContainer.appendChild(errorDiv);
      throw error;
    }
  }

  // 实现拖拽功能
  function enableDragging(element) {
    element.addEventListener('mousedown', (e) => {
      // 只有点击非按钮区域才允许拖拽
      if (e.target.closest('.qrcode-btn')) {
        return;
      }

      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      element.style.cursor = 'grabbing';
      element.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // 限制在窗口内
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;

      const clampedX = Math.max(0, Math.min(x, maxX));
      const clampedY = Math.max(0, Math.min(y, maxY));

      element.style.left = clampedX + 'px';
      element.style.top = clampedY + 'px';
      element.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = 'move';
        element.style.transition = 'all 0.3s ease';

        // 保存位置到存储
        GM_setValue('qrcodeWindowPosition', {
          left: element.style.left,
          top: element.style.top
        });

        // 自动吸附到最近的边缘
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算距离各边缘的距离
        const distances = {
          left: centerX,
          right: windowWidth - centerX,
          top: centerY,
          bottom: windowHeight - centerY
        };

        // 找到最近的边缘
        const closestEdge = Object.keys(distances).reduce((a, b) =>
          distances[a] < distances[b] ? a : b
        );

        // 吸附到边缘
        switch (closestEdge) {
          case 'left':
            element.style.left = '10px';
            break;
          case 'right':
            element.style.left = (windowWidth - rect.width - 10) + 'px';
            break;
          case 'top':
            element.style.top = '10px';
            break;
          case 'bottom':
            element.style.top = (windowHeight - rect.height - 10) + 'px';
            break;
        }
      }
    });

    // 防止拖拽时选择文本
    element.addEventListener('selectstart', (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    });

    // 触摸设备支持
    element.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      // 只有点击非按钮区域才允许拖拽
      if (e.target.closest('.qrcode-btn')) {
        return;
      }

      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      element.style.cursor = 'grabbing';
      element.style.transition = 'none';
      e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const x = touch.clientX - offsetX;
      const y = touch.clientY - offsetY;

      // 限制在窗口内
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;

      const clampedX = Math.max(0, Math.min(x, maxX));
      const clampedY = Math.max(0, Math.min(y, maxY));

      element.style.left = clampedX + 'px';
      element.style.top = clampedY + 'px';
      element.style.transform = 'none';
      e.preventDefault();
    });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = 'move';
        element.style.transition = 'all 0.3s ease';

        // 保存位置到存储
        GM_setValue('qrcodeWindowPosition', {
          left: element.style.left,
          top: element.style.top
        });

        // 自动吸附到最近的边缘
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算距离各边缘的距离
        const distances = {
          left: centerX,
          right: windowWidth - centerX,
          top: centerY,
          bottom: windowHeight - centerY
        };

        // 找到最近的边缘
        const closestEdge = Object.keys(distances).reduce((a, b) =>
          distances[a] < distances[b] ? a : b
        );

        // 吸附到边缘
        switch (closestEdge) {
          case 'left':
            element.style.left = '10px';
            break;
          case 'right':
            element.style.left = (windowWidth - rect.width - 10) + 'px';
            break;
          case 'top':
            element.style.top = '10px';
            break;
          case 'bottom':
            element.style.top = (windowHeight - rect.height - 10) + 'px';
            break;
        }
      }
    });
  }

  // 预加载字体图标和二维码库
  async function preloadResources() {
    await loadFontAwesome();
    await importQRCode();
  }

  // 初始化函数
  async function initQRCodeGenerator() {
    // 先判断哈希值，不匹配则直接退出，不执行后续逻辑
    if (!isTargetUrl()) {
      console.log('当前页面哈希值不匹配，不加载二维码生成器');
      return;
    }

    try {
      // 先加载字体图标
      await loadFontAwesome();

      // 导入二维码库
      await importQRCode();

      // 创建样式
      createStyles();

      // 创建悬浮窗
      const floatingWindow = createFloatingWindow();
      if (!floatingWindow) {
        throw new Error('无法创建悬浮窗口');
      }

      // 启用拖拽
      enableDragging(floatingWindow);

      // 生成初始二维码
      await updateQRCode();

      console.log('页面信息二维码生成器已启动！');
      showNotification('二维码生成器已启动', 'success');
    } catch (error) {
      console.error('初始化失败:', error);
      // 图标加载失败时仍然显示通知，只是没有图标
      showNotification('二维码生成器初始化失败，请刷新页面重试', 'error');
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    preloadResources();
  } else {
    document.addEventListener('DOMContentLoaded', preloadResources);
  }

  // 监听hash变化（如单页应用）
  window.addEventListener('hashchange', () => {
    const floatingWindow = document.getElementById('qrcode-floating-window');
    if (isTargetUrl()) {
      // 切换到目标hash，初始化生成器
      if (!floatingWindow) initQRCodeGenerator();
    } else {
      // 离开目标hash，移除生成器
      if (floatingWindow) {
        floatingWindow.remove();
        // 清除通知
        const notification = document.getElementById('qrcode-notification');
        if (notification) notification.remove();
      }
    }
  });

})();

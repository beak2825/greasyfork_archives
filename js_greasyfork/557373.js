// ==UserScript==
// @name         NGA安价快捷收集
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  点击楼层内容即可复制，支持自动编号、保留格式、保留空行等配置
// @author       ChangingSelf
// @match        https://ngabbs.com/read.php*
// @match        https://bbs.nga.cn/read.php*
// @match        https://nga.178.com/read.php*
// @match        https://g.nga.cn/read.php*
// @icon         https://img.nga.178.com/attachments/mon_202107/02/-otpguQ2o-bowcK2S14-14.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557373/NGA%E5%AE%89%E4%BB%B7%E5%BF%AB%E6%8D%B7%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/557373/NGA%E5%AE%89%E4%BB%B7%E5%BF%AB%E6%8D%B7%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 配置管理
  const config = {
    autoNumber: GM_getValue('autoNumber', true),
    enabled: GM_getValue('enabled', true),
    currentNumber: GM_getValue('currentNumber', 1),
    addFloorNumber: GM_getValue('addFloorNumber', false),
    autoCollectRegex: GM_getValue('autoCollectRegex', '安价'),
    excludeUids: GM_getValue('excludeUids', ''),
    btnPosition: GM_getValue('btnPosition', null)
  };

  // 保存配置
  function saveConfig() {
    GM_setValue('autoNumber', config.autoNumber);
    GM_setValue('enabled', config.enabled);
    GM_setValue('currentNumber', config.currentNumber);
    GM_setValue('addFloorNumber', config.addFloorNumber);
    GM_setValue('autoCollectRegex', config.autoCollectRegex);
    GM_setValue('excludeUids', config.excludeUids);
    if (config.btnPosition) {
      GM_setValue('btnPosition', config.btnPosition);
    }
  }

  // 添加配置按钮样式和面板样式
  GM_addStyle(`
      /* 配置按钮 */
      #nga-config-btn {
          position: fixed;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: ${config.enabled ? '#FF6B35' : '#999'};
          color: white;
          border: none;
          border-radius: 50%;
          cursor: move;
          font-size: 18px;
          font-weight: bold;
          z-index: 999999;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          user-select: none;
      }
      #nga-config-btn:not([style*="left"]) {
          right: 10px;
      }
      #nga-config-btn:hover {
          background: ${config.enabled ? '#ff8533' : '#777'};
      }
      #nga-config-btn:hover:not(.dragging) {
          transform: translateY(-50%) scale(1.1);
      }
      #nga-config-btn.dragging {
          cursor: grabbing;
          transition: none;
          opacity: 0.8;
      }

      /* 配置面板 */
      #nga-config-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 260px;
          background: white;
          border: 2px solid #FF6B35;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 999999;
          display: none;
      }
      #nga-config-btn:not(.dragging):active {
          cursor: pointer;
      }
      #nga-config-panel.show {
          display: block;
      }
      #nga-config-panel h3 {
          margin: 0 0 15px 0;
          color: #FF6B35;
          font-size: 18px;
          text-align: center;
      }
      .config-item {
          margin: 15px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
      .config-item label {
          font-size: 14px;
          color: #333;
          flex: 1;
      }
      .config-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin: 0;
      }
      .config-number {
          margin: 15px 0;
          text-align: center;
      }
      .config-number label {
          display: block;
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
      }
      .config-number input {
          width: 60px;
          padding: 5px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
      }
      .config-number {
          margin: 15px 0;
          text-align: center;
      }
      .config-number label {
          display: block;
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
      }
      .config-number input {
          width: 60px;
          padding: 5px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
      }
      .config-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
      }
      .config-buttons button {
          flex: 1;
          min-width: 100px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s;
      }
      #nga-reset-btn {
          background: #f44336;
          color: white;
      }
      #nga-reset-btn:hover {
          background: #d32f2f;
      }
      #nga-collect-btn {
          background: #4CAF50;
          color: white;
      }
      #nga-collect-btn:hover {
          background: #45a049;
      }
      #nga-dice-btn {
          background: #2196F3;
          color: white;
      }
      #nga-dice-btn:hover {
          background: #1976D2;
      }
      #nga-close-btn {
          background: #607D8B;
          color: white;
      }
      #nga-close-btn:hover {
          background: #455A64;
      }

      /* 悬停时的文本凸出阴影效果 */
      .post-content-hover {
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          display: inline-block;
          border-radius: 6px;
          padding: 4px;
      }
      .post-content-hover:hover {
          outline: 3px solid #FF6B35;
          outline-offset: -1px;
      }

      /* 复制成功/失败提示框 */
      .copy-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          color: white;
          border-radius: 5px;
          z-index: 9999999;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
      }
      .copy-toast.show {
          opacity: 1;
      }
      .copy-toast.success {
          background-color: #4CAF50;
      }
      .copy-toast.error {
          background-color: #f44336;
      }
  `);

  // 2. 创建配置按钮和面板
  function createConfigUI() {
    // 创建配置按钮
    const configBtn = document.createElement('button');
    configBtn.id = 'nga-config-btn';
    configBtn.textContent = '⚙';
    configBtn.title = 'NGA安价收集配置 - 可拖动';

    // 如果有保存的位置，应用它
    if (config.btnPosition) {
      configBtn.style.top = config.btnPosition.top;
      configBtn.style.left = config.btnPosition.left;
      configBtn.style.right = 'auto';
      configBtn.style.transform = config.btnPosition.transform;
    } else {
      // 设置初始位置
      const viewportWidth = window.innerWidth;
      configBtn.style.top = '50%';
      configBtn.style.left = (viewportWidth - 50) + 'px';
      configBtn.style.right = 'auto';
      configBtn.style.transform = 'translateY(-50%)';
    }

    document.body.appendChild(configBtn);

    // 添加拖动功能
    let isDragging = false;
    let startY, startX;

    // 鼠标按下时开始拖动
    configBtn.addEventListener('mousedown', (e) => {
        isDragging = true;
        configBtn.classList.add('dragging');

        const btnRect = configBtn.getBoundingClientRect();
        startY = e.clientY - btnRect.top; // 鼠标相对于按钮顶部的偏移
        startX = e.clientX - btnRect.left; // 鼠标相对于按钮左侧的偏移

        
        e.preventDefault();
    });

    // 鼠标移动时更新位置
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 计算新位置（考虑鼠标偏移）
        const newTop = e.clientY - startY;
        const newLeft = e.clientX - startX;

        // 限制在视窗内
        const maxTop = window.innerHeight - 40;
        const maxLeft = window.innerWidth - 40;

        configBtn.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        configBtn.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        configBtn.style.right = 'auto';
        configBtn.style.transform = 'translateY(0)';
    });

    // 鼠标释放时停止拖动并保存位置
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;

        isDragging = false;
        configBtn.classList.remove('dragging');

        // 保存位置（只保存实际使用的值）
        config.btnPosition = {
            top: configBtn.style.top,
            left: configBtn.style.left,
            transform: configBtn.style.transform || 'translateY(0)'
        };
        saveConfig();
    });

    
    // 创建配置面板
    const panel = document.createElement('div');
    panel.id = 'nga-config-panel';
    panel.innerHTML = `
        <h3>安价收集配置</h3>
        <div class="config-item">
            <label for="nga-enabled">启用收集</label>
            <input type="checkbox" id="nga-enabled" ${config.enabled ? 'checked' : ''}>
        </div>
        <div class="config-item">
            <label for="auto-number">自动编号</label>
            <input type="checkbox" id="auto-number" ${config.autoNumber ? 'checked' : ''}>
        </div>
        <div class="config-item">
            <label for="add-floor-number">添加楼层号</label>
            <input type="checkbox" id="add-floor-number" ${config.addFloorNumber ? 'checked' : ''}>
        </div>
        <div class="config-number">
            <label for="current-number">下一个编号</label>
            <input type="number" id="current-number" value="${config.currentNumber}" min="1">
        </div>
        <div class="config-number">
            <label for="collected-count">已收集数量</label>
            <input type="number" id="collected-count" value="${config.currentNumber - 1}" min="0" readonly style="background: #f5f5f5;">
        </div>
        <div class="config-item" style="flex-direction: column; align-items: flex-start;">
            <label for="auto-collect-regex" style="margin-bottom: 5px;">自动收集匹配词（正则表达式）</label>
            <input type="text" id="auto-collect-regex" value="${config.autoCollectRegex}" placeholder="输入关键词或正则表达式"
                   style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div class="config-item" style="flex-direction: column; align-items: flex-start;">
            <label for="exclude-uids" style="margin-bottom: 5px;">排除UID（每行一个）</label>
            <textarea id="exclude-uids" placeholder="输入要排除的UID，每行一个"
                      style="width: 100%; height: 60px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;">${config.excludeUids}</textarea>
        </div>
        <div class="config-buttons">
            <button id="nga-collect-btn">自动收集</button>
            <button id="nga-dice-btn">生成骰点</button>
            <button id="nga-reset-btn">重置编号</button>
            <button id="nga-close-btn">关闭</button>
        </div>
    `;
    document.body.appendChild(panel);

    // 更新按钮状态
    function updateButtonStatus() {
        configBtn.style.background = config.enabled ? '#FF6B35' : '#999';
        configBtn.style.boxShadow = config.enabled ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)';
    }

    // 事件处理
    configBtn.addEventListener('click', () => {
        // 如果刚刚结束拖动，不触发点击
        if (isDragging || configBtn.classList.contains('dragging')) {
            return;
        }

        // 面板始终显示在屏幕中央
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.right = 'auto';
        panel.style.transform = 'translate(-50%, -50%)';

        panel.classList.toggle('show');
    });

    // 启用/禁用切换
    document.getElementById('nga-enabled').addEventListener('change', (e) => {
        config.enabled = e.target.checked;
        saveConfig();
        updateButtonStatus();

        // 更新楼层的交互状态 - 使用id来查找所有postcontent元素
        const allCandidates = document.querySelectorAll('[id^="postcontent"]');
        const postContents = Array.from(allCandidates).filter(element => {
            return /^postcontent\d+$/.test(element.id);
        });

        postContents.forEach(content => {
            if (config.enabled) {
                content.classList.add('post-content-hover');
                content.style.cursor = 'pointer';
            } else {
                content.classList.remove('post-content-hover');
                content.style.cursor = 'default';
            }
        });

        showToast(config.enabled ? '安价收集已启用' : '安价收集已关闭');
    });

    // 自动编号切换
    document.getElementById('auto-number').addEventListener('change', (e) => {
        config.autoNumber = e.target.checked;
        saveConfig();
    });

    // 添加楼层号切换
    document.getElementById('add-floor-number').addEventListener('change', (e) => {
        config.addFloorNumber = e.target.checked;
        saveConfig();
    });

    // 当前编号修改
    document.getElementById('current-number').addEventListener('change', (e) => {
        const num = parseInt(e.target.value);
        if (num >= 1) {
            config.currentNumber = num;
            saveConfig();
        } else {
            e.target.value = config.currentNumber;
        }
    });

    // 正则表达式配置修改
    document.getElementById('auto-collect-regex').addEventListener('change', (e) => {
        config.autoCollectRegex = e.target.value;
        saveConfig();
    });

    // 排除UID名单配置修改
    document.getElementById('exclude-uids').addEventListener('change', (e) => {
        config.excludeUids = e.target.value;
        saveConfig();
    });

    // 自动收集功能
    document.getElementById('nga-collect-btn').addEventListener('click', () => {
        autoCollectPosts();
    });

    // 生成骰点
    document.getElementById('nga-dice-btn').addEventListener('click', () => {
        const count = config.currentNumber - 1;
        if (count > 0) {
            const diceCode = `[dice]d${count}[/dice]`;
            navigator.clipboard.writeText(diceCode)
                .then(() => showToast(`已复制骰点代码: ${diceCode}`))
                .catch(err => {
                    console.error('无法复制骰点代码: ', err);
                    showToast('复制失败，请手动复制', false);
                });
        } else {
            showToast('没有收集到任何选项', false);
        }
    });

    // 重置编号
    document.getElementById('nga-reset-btn').addEventListener('click', () => {
        config.currentNumber = 1;
        document.getElementById('current-number').value = 1;
        document.getElementById('collected-count').value = 0;
        saveConfig();
        showToast('编号已重置');
    });

    // 关闭面板
    document.getElementById('nga-close-btn').addEventListener('click', () => {
        panel.classList.remove('show');
    });

    // 点击面板外部关闭
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !configBtn.contains(e.target)) {
            panel.classList.remove('show');
        }
    });
  }

  // 3. 创建复制提示框
  let toast = document.createElement('div');
  toast.className = 'copy-toast';
  document.body.appendChild(toast);

  // 4. 显示提示框的函数
  function showToast(message, isSuccess = true) {
      toast.textContent = message;
      toast.classList.remove('success', 'error', 'show');
      toast.classList.add(isSuccess ? 'success' : 'error');
      setTimeout(() => toast.classList.add('show'), 10);
      setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // 5. 深度清理所有 .quote 元素
  function deepCleanQuotes(element) {
      const clone = element.cloneNode(true);
      const quotes = clone.querySelectorAll('.quote');
      quotes.forEach(quote => quote.remove());
      return clone;
  }

  // 获取文本内容
  function getTextContent(element) {
    // 清理引用块并获取文本
    const cleanedElement = deepCleanQuotes(element);
    let text = cleanedElement.innerText || cleanedElement.textContent || '';

    // 移除多余空行
    text = text.replace(/\n\s*\n/g, '\n');

    return text.trim();
  }

  // 获取楼层作者UID
  function getPostUid(contentElement) {
    // 从contentElement的id中提取楼层号
    const floorMatch = contentElement.id.match(/postcontent(\d+)/);
    if (!floorMatch) {
      console.log('无法提取楼层号:', contentElement.id);
      return null;
    }

    const floorNumber = floorMatch[1];
    console.log('提取的楼层号:', floorNumber);

    // 找到对应的post1strow元素
    const postRow = document.getElementById(`post1strow${floorNumber}`);
    if (!postRow) {
      console.log('未找到post1strow元素:', `post1strow${floorNumber}`);
      return null;
    }

    // 在postRow中查找posterinfo元素
    const posterInfo = postRow.querySelector('#posterinfo' + floorNumber);
    if (!posterInfo) {
      console.log('未找到posterinfo元素:', `#posterinfo${floorNumber}`);
      return null;
    }

    // 查找带有name="uid"的a标签
    const uidLink = posterInfo.querySelector('a[name="uid"]');
    if (!uidLink) {
      console.log('未找到uid链接:', posterInfo);
      return null;
    }

    console.log('找到uid链接:', uidLink);
    console.log('链接文本:', uidLink.textContent?.trim());

    // 从链接的文本内容中提取UID（UID是纯数字）
    const uidText = uidLink.textContent?.trim();
    if (uidText && /^\d+$/.test(uidText)) {
      console.log('成功提取UID:', uidText);
      return uidText; // 返回数字UID
    }

    // 如果文本不是纯数字，尝试从href中提取（备用方案）
    if (uidLink.href && uidLink.href !== 'javascript:void(0)') {
      console.log('尝试从href提取UID:', uidLink.href);
      const hrefMatch = uidLink.href.match(/uid=(\d+)/);
      if (hrefMatch) {
        console.log('从href成功提取UID:', hrefMatch[1]);
        return hrefMatch[1];
      }
    }

    console.log('无法提取UID，文本内容:', uidText, '链接href:', uidLink.href);
    return null;
  }

  // 检查UID是否在排除列表中
  function shouldExcludeUid(uid) {
    console.log('检查UID是否需要排除:', uid);
    console.log('排除UID列表:', config.excludeUids);

    if (!config.excludeUids || !uid) return false;

    // 将排除UID列表按行分割并去除空白
    const excludeList = config.excludeUids.split('\n')
        .map(uid => uid.trim())
        .filter(uid => uid.length > 0);

    console.log('处理后的排除列表:', excludeList);

    // 检查UID是否在排除列表中
    const shouldExclude = excludeList.some(excludeUid => uid === excludeUid);
    console.log('是否排除:', shouldExclude);
    return shouldExclude;
  }

  // 6. 自动收集功能
  function autoCollectPosts() {
      if (!config.autoCollectRegex || config.autoCollectRegex.trim() === '') {
          showToast('请先输入匹配关键词', false);
          return;
      }

      try {
          // 创建正则表达式（使用全局匹配和不区分大小写）
          const regex = new RegExp(config.autoCollectRegex, 'gi');

          // 获取所有楼层内容
          const allCandidates = document.querySelectorAll('[id^="postcontent"]');
          const postContents = Array.from(allCandidates).filter(element => {
              return /^postcontent\d+$/.test(element.id);
          });

          if (postContents.length === 0) {
              showToast('未找到楼层内容', false);
              return;
          }

          // 收集匹配的楼层内容
          let collectedText = '';
          let matchCount = 0;
          let excludedCount = 0;

          postContents.forEach(content => {
              const text = getTextContent(content);
              if (text && regex.test(text)) {
                  // 重置正则表达式的lastIndex以便下次匹配
                  regex.lastIndex = 0;

                  // 获取楼层作者并检查是否需要排除
                  const uid = getPostUid(content);
                  console.log('楼层UID:', uid); // 调试信息

                  if (shouldExcludeUid(uid)) {
                      console.log('排除UID:', uid); // 调试信息
                      excludedCount++;
                      return; // 跳过此楼层
                  }

                  matchCount++;

                  // 获取楼层号
                  let floorNumberText = '';
                  if (config.addFloorNumber && content.id) {
                      const match = content.id.match(/postcontent(\d+)/);
                      if (match) {
                          floorNumberText = `(${match[1]}L) `;
                      }
                  }

                  // 构建收集的文本
                  let postText;
                  if (floorNumberText) {
                      postText = `${config.currentNumber}. ${floorNumberText}${text}\n`;
                  } else {
                      postText = `${config.currentNumber}. ${text}\n`;
                  }

                  collectedText += postText;
                  config.currentNumber++;
              }
          });

          if (matchCount === 0) {
              if (excludedCount > 0) {
                  showToast(`找到匹配楼层但已排除 ${excludedCount} 个楼层`, false);
              } else {
                  showToast(`未找到包含"${config.autoCollectRegex}"的楼层`, false);
              }
              return;
          }

          // 复制到剪贴板
          navigator.clipboard.writeText(collectedText)
              .then(() => {
                  // 更新显示
                  document.getElementById('current-number').value = config.currentNumber;
                  document.getElementById('collected-count').value = config.currentNumber - 1;
                  saveConfig();

                  let message = `成功收集 ${matchCount} 条内容并复制到剪贴板`;
                  if (excludedCount > 0) {
                      message += `，已排除 ${excludedCount} 个楼层`;
                  }
                  showToast(message);
              })
              .catch(err => {
                  console.error('无法复制文本: ', err);
                  showToast('复制失败，请手动复制', false);
              });

      } catch (error) {
          console.error('正则表达式错误: ', error);
          showToast('正则表达式格式错误', false);
      }
  }

  // 7. 核心复制逻辑函数
  function copyPostContent(element) {
      if (!config.enabled) {
          return false;
      }

      const cleanedElement = deepCleanQuotes(element);
      let textToCopy = getTextContent(cleanedElement);

      if (!textToCopy) {
          showToast('复制失败：没有可复制的文本', false);
          return false;
      }

      // 获取楼层号
      let floorNumberText = '';
      if (config.addFloorNumber && element.id) {
          const match = element.id.match(/postcontent(\d+)/);
          if (match) {
              floorNumberText = `(${match[1]}L) `;
          }
      }

      // 添加编号和楼层号
      if (config.autoNumber) {
          if (floorNumberText) {
              textToCopy = `${config.currentNumber}. ${floorNumberText}${textToCopy}`;
          } else {
              textToCopy = `${config.currentNumber}. ${textToCopy}`;
          }
          config.currentNumber++;

          // 更新显示
          document.getElementById('current-number').value = config.currentNumber;
          document.getElementById('collected-count').value = config.currentNumber - 1;

          saveConfig();
      } else if (floorNumberText) {
          textToCopy = `${floorNumberText}${textToCopy}`;
      }

      // 只添加一个换行符
      textToCopy += '\n';

      navigator.clipboard.writeText(textToCopy)
          .then(() => showToast('复制成功！'))
          .catch(err => {
              console.error('无法复制文本: ', err);
              showToast('复制失败，请手动复制', false);
          });

      return true;
  }

  // 8. 为目标楼层内容元素添加功能（核心修正点）
  function init() {
      // 创建配置UI
      createConfigUI();

      // 使用更宽泛的选择器，然后用 filter 进行精确过滤
      const allCandidates = document.querySelectorAll('[id^="postcontent"]');

      // 使用正则表达式过滤出 id 为 "postcontent" + "数字" 格式的元素
      const postContents = Array.from(allCandidates).filter(element => {
          return /^postcontent\d+$/.test(element.id);
      });

      postContents.forEach(content => {
          if (config.enabled) {
              content.classList.add('post-content-hover');
          }
          // 根据启用状态设置鼠标样式
          content.style.cursor = config.enabled ? 'pointer' : 'default';
          content.addEventListener('click', function(e) {
              if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
              copyPostContent(this);
          });
      });
  }

  // 初始化
  if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
  } else {
      init();
  }

})();